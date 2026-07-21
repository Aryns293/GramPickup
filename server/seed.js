require('dotenv').config();
const mongoose = require('mongoose');
const User     = require('./models/User');
const Shop     = require('./models/Shop');
const Parcel   = require('./models/Parcel');
const Notification = require('./models/Notification');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    await User.deleteMany({});
    await Shop.deleteMany({});
    await Parcel.deleteMany({});
    await Notification.deleteMany({});
    console.log('Cleared existing data.');

    // Admin — credentials from env vars (keep these private)
    const adminEmail    = process.env.ADMIN_EMAIL    || 'admin@grampickup.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'changeme_set_in_env';

    await User.create({
      name: 'Admin',
      email: adminEmail,
      phone: '0000000000',
      password: adminPassword,
      role: 'admin',
    });
    console.log(`Admin created: ${adminEmail}`);

    // Demo customer
    const customer = await User.create({
      name: 'Ramesh Kumar',
      email: 'customer1@grampickup.com',
      phone: '9998887777',
      password: 'customer123',
      role: 'customer',
    });
    console.log('Customer created: customer1@grampickup.com / customer123');

    // Demo shopkeeper
    const shopkeeper = await User.create({
      name: 'Suresh Patel',
      email: 'shopkeeper1@grampickup.com',
      phone: '8887776666',
      password: 'shopkeeper123',
      role: 'shopkeeper',
    });
    console.log('Shopkeeper created: shopkeeper1@grampickup.com / shopkeeper123');

    // Demo approved shop
    await Shop.create({
      shopName: 'Patel Kirana & General Store',
      ownerId: shopkeeper._id,
      ownerName: shopkeeper.name,
      address: 'Shop No. 5, Main Chowk, Village Rampur',
      city: 'Korai',
      phone: shopkeeper.phone,
      verificationStatus: 'approved',
      shopPhoto: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=400&q=80',
      latitude: 28.6139,
      longitude: 77.2090,
    });
    console.log('Demo shop created and approved.');

    console.log('\nSeed completed successfully.');
    console.log('NOTE: Admin credentials are set via ADMIN_EMAIL and ADMIN_PASSWORD in your .env');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
