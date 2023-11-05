const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: 'product',
        },
        quantity: {
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

cartSchema.pre(/^find/, function (next) {
  this.populate({ path: 'cartItems.product'});
  next();
});

module.exports = mongoose.model('cart', cartSchema);
