const Parcel = require('../models/Parcel');
const Notification = require('../models/Notification');
const { getFeeDetails } = require('./fees');

const updateFees = async () => {
  try {
    const activeParcels = await Parcel.find({
      status: { $in: ['Arrived', 'Ready for Pickup'] },
    }).populate('shopId');

    console.log(`[FeeScheduler] Checking fee updates for ${activeParcels.length} active parcels...`);

    for (const parcel of activeParcels) {
      const { daysStored, fee: newFee } = getFeeDetails(parcel);

      if (newFee > parcel.fee) {
        const oldFee = parcel.fee;
        parcel.fee = newFee;
        await parcel.save();

        const shopName = parcel.shopId ? parcel.shopId.shopName : 'the pickup store';

        await Notification.create({
          userId: parcel.customerId,
          title: `Storage Fee Update: ₹${newFee}`,
          message: `Your parcel "${parcel.parcelName}" (Tracking: ${parcel.trackingNumber}) has been stored for ${daysStored} day(s) at "${shopName}". Storage fee updated from ₹${oldFee} to ₹${newFee}. Please collect it soon.`,
        });

        console.log(`[FeeScheduler] Updated parcel ${parcel.trackingNumber} fee: ₹${oldFee} → ₹${newFee}`);
      }
    }
  } catch (error) {
    console.error('[FeeScheduler] Error updating fees:', error);
  }
};

const startFeeScheduler = () => {
  updateFees();
  const intervalMs = 60 * 60 * 1000; // 1 hour
  setInterval(updateFees, intervalMs);
  console.log('[FeeScheduler] Background storage fee scheduler initialized (interval: 1 hour).');
};

module.exports = { startFeeScheduler, updateFees };
