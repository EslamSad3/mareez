const mongoose = require('mongoose');
const Product = require('./productModel');
const reviewSchema = new mongoose.Schema(
  {
    name: {
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
      ref: 'user',
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

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name' });
  next();
});

reviewSchema.statics.averageRatingAndQuantity = async function (productId) {
  const result = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: 'product',
        averageRating: { $avg: '$rating' },
        ratingQuantity: { $sum: 1 },
      },
    },
  ]);
  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: result[0].averageRating,
      rates: result[0].ratingQuantity,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      rating: 0,
      rates: 0,
    });
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.averageRatingAndQuantity(this.product);
});
reviewSchema.post('findOneAndDelete', async function (doc) {
  await doc.constructor.averageRatingAndQuantity(doc.product);
});

module.exports = mongoose.model('review', reviewSchema);
