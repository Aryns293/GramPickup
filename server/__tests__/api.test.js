const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../server');
const User = require('../models/User');
const Shop = require('../models/Shop');
const Parcel = require('../models/Parcel');
const Notification = require('../models/Notification');

let mongoServer;

const userPayload = {
  customer: {
    name: 'Ramesh Kumar',
    email: 'customer@test.com',
    phone: '9998887777',
    password: 'customer123',
    role: 'customer',
  },
  shopkeeper: {
    name: 'Suresh Patel',
    email: 'shopkeeper@test.com',
    phone: '8887776666',
    password: 'shopkeeper123',
    role: 'shopkeeper',
  },
  admin: {
    name: 'System Admin',
    email: 'admin@test.com',
    phone: '7776665555',
    password: 'admin123',
    role: 'admin',
  },
};

const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

async function registerAndLogin(role) {
  if (role === 'admin') {
    await User.create(userPayload.admin);
  } else {
    await request(app).post('/api/auth/register').send(userPayload[role]).expect(201);
  }

  const login = await request(app)
    .post('/api/auth/login')
    .send({
      email: userPayload[role].email,
      password: userPayload[role].password,
    })
    .expect(200);

  return login.body;
}

async function createApprovedShop(shopkeeperToken) {
  const shopResponse = await request(app)
    .post('/api/shops')
    .set(authHeader(shopkeeperToken))
    .send({
      shopName: 'Patel Kirana Store',
      address: 'Main Chowk, Rampur',
      city: 'Rampur',
      phone: '8887776666',
      latitude: 28.6139,
      longitude: 77.209,
    })
    .expect(201);

  await Shop.findByIdAndUpdate(shopResponse.body._id, { verificationStatus: 'approved' });
  return Shop.findById(shopResponse.body._id);
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  await Promise.all([
    User.deleteMany({}),
    Shop.deleteMany({}),
    Parcel.deleteMany({}),
    Notification.deleteMany({}),
  ]);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('GramPickup API', () => {
  test('validates registration input and prevents invalid users', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'A',
        email: 'not-an-email',
        phone: '123',
        password: '123',
      })
      .expect(400);

    expect(response.body.message).toBe('Validation failed');
    expect(response.body.errors.length).toBeGreaterThan(0);
  });

  test('protects role-specific routes', async () => {
    const customer = await registerAndLogin('customer');

    await request(app)
      .get('/api/analytics/dashboard')
      .set(authHeader(customer.token))
      .expect(403);
  });

  test('supports shop approval, parcel lifecycle, OTP handover, notifications, and analytics', async () => {
    const customer = await registerAndLogin('customer');
    const shopkeeper = await registerAndLogin('shopkeeper');
    const admin = await registerAndLogin('admin');
    const shop = await createApprovedShop(shopkeeper.token);

    const parcelResponse = await request(app)
      .post('/api/parcels')
      .set(authHeader(customer.token))
      .send({
        parcelName: 'Gardening Kit',
        trackingNumber: 'TRK-1001',
        shopId: shop._id.toString(),
        expectedArrivalDate: '2026-07-10',
      })
      .expect(201);

    expect(parcelResponse.body.status).toBe('Expected');
    expect(parcelResponse.body.timeline).toHaveLength(1);

    await request(app)
      .put(`/api/parcels/${parcelResponse.body._id}/received`)
      .set(authHeader(customer.token))
      .expect(403);

    const received = await request(app)
      .put(`/api/parcels/${parcelResponse.body._id}/received`)
      .set(authHeader(shopkeeper.token))
      .expect(200);

    expect(received.body.status).toBe('Arrived');
    expect(received.body.fee).toBe(10);

    const ready = await request(app)
      .put(`/api/parcels/${parcelResponse.body._id}/ready`)
      .set(authHeader(shopkeeper.token))
      .expect(200);

    expect(ready.body.status).toBe('Ready for Pickup');
    expect(ready.body.otp).toMatch(/^\d{6}$/);

    await request(app)
      .put(`/api/parcels/${parcelResponse.body._id}/deliver`)
      .set(authHeader(shopkeeper.token))
      .send({ otp: '000000' })
      .expect(400);

    const delivered = await request(app)
      .put(`/api/parcels/${parcelResponse.body._id}/deliver`)
      .set(authHeader(shopkeeper.token))
      .send({ otp: ready.body.otp })
      .expect(200);

    expect(delivered.body.status).toBe('Delivered');
    expect(delivered.body.timeline.map((event) => event.status)).toEqual([
      'Expected',
      'Arrived',
      'Ready for Pickup',
      'Delivered',
    ]);

    const notifications = await request(app)
      .get('/api/notifications')
      .set(authHeader(customer.token))
      .expect(200);

    expect(notifications.body.length).toBeGreaterThanOrEqual(3);

    const analytics = await request(app)
      .get('/api/analytics/dashboard')
      .set(authHeader(admin.token))
      .expect(200);

    expect(analytics.body.summary.totalParcels).toBe(1);
    expect(analytics.body.summary.statusBreakdown.Delivered).toBe(1);
    expect(analytics.body.summary.totalRevenue).toBeGreaterThanOrEqual(10);
  });

  test('allows customers to cancel expected parcels before arrival', async () => {
    const customer = await registerAndLogin('customer');
    const shopkeeper = await registerAndLogin('shopkeeper');
    const shop = await createApprovedShop(shopkeeper.token);

    const parcel = await request(app)
      .post('/api/parcels')
      .set(authHeader(customer.token))
      .send({
        parcelName: 'Books',
        trackingNumber: 'TRK-2002',
        shopId: shop._id.toString(),
        expectedArrivalDate: '2026-07-12',
      })
      .expect(201);

    const cancelled = await request(app)
      .put(`/api/parcels/${parcel.body._id}/cancel`)
      .set(authHeader(customer.token))
      .send({ reason: 'Order cancelled by seller' })
      .expect(200);

    expect(cancelled.body.status).toBe('Cancelled');
    expect(cancelled.body.cancellationReason).toBe('Order cancelled by seller');
    expect(cancelled.body.timeline.map((event) => event.status)).toEqual(['Expected', 'Cancelled']);
  });
});
