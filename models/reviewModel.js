const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: 'string',
    },
    rating: {
      type: Number,
      min: [1, 'rating must be greater than 1'],
      max: [5, 'rating must be less than or equal 5'],
      required: [true, 'review rating required'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'review Must belong to user'],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'review Must belong to product'],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('review', reviewSchema);
