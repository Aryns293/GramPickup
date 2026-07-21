/**
 * Calculates storage days and fee for a parcel.
 * Base fee: ₹10. Daily rate: ₹2/day after arrival.
 */
const getFeeDetails = (parcel) => {
  if (!parcel.arrivalDate || parcel.status === 'Expected') {
    return { daysStored: 0, fee: 0 };
  }
  const start = new Date(parcel.arrivalDate);
  const end = parcel.pickupDate ? new Date(parcel.pickupDate) : new Date();

  const diffTime = end.getTime() - start.getTime();
  const daysStored = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  const fee = 10 + daysStored * 2;
  return { daysStored, fee };
};

module.exports = { getFeeDetails };
