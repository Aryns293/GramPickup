const mongoose = require('mongoose');

const parcelSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
  },
  parcelName: {
    type: String,
    required: true,
    trim: true,
  },
  trackingNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  expectedArrivalDate: {
    type: Date,
    required: true,
  },
  arrivalDate: {
    type: Date,
  },
  pickupDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Expected', 'Arrived', 'Ready for Pickup', 'Delivered', 'Cancelled'],
    default: 'Expected',
  },
  otp: {
    type: String,
  },
  fee: {
    type: Number,
    default: 0,
  },
  cancellationReason: {
    type: String,
    trim: true,
  },
  timeline: [{
    status: {
      type: String,
      enum: ['Expected', 'Arrived', 'Ready for Pickup', 'Delivered', 'Cancelled'],
      required: true,
    },
    note: {
      type: String,
      trim: true,
    },
    actorRole: {
      type: String,
      enum: ['customer', 'shopkeeper', 'admin', 'system'],
      default: 'system',
    },
    occurredAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Parcel', parcelSchema);
