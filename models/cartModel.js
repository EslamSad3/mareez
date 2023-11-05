const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: 'product',
        },
        cartQuantity: {
          type: Number,
          default: 1,
        },
        color: String,
        size: String,
        price: String,
      },
    ],
    total: Number,
    totalAfterDiscount: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
    },
  },
  { timestamps: true }
);




module.exports = mongoose.model('cart', cartSchema);
