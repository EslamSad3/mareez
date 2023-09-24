const mongoose = require('mongoose');
const couponSchema = new mongoose.Schema(
  {
    name: {
      type: 'string',
      trim: true,
      required: [true, 'Coupon Name Required'],
      unique: [true, 'Coupon Name Must Be Unique'],
    },
    expire: {
      type: Date,
      required: [true, 'Coupon expiration date required'],
    },
    discount: {
      type: Number,
      required: [true, 'Coupon discount required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('coupon', couponSchema);
