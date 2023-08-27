const mongoose = require('mongoose');

const productShema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'title is required'],
      unique: [true, 'title must be unique'],
      trim: true,
      minlength: [3, 'Too short product name'],
      maxlength: [100, 'Too long product name'],
    },
    slug: {
      type: String,
      required: [true, 'slug is required'],
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'description is required'],
      trim: true,
      minlength: [5, 'Too short description'],
      maxlength: [10000, 'Too long description'],
    },
    quantity: {
      type: Number,
      required: [true, 'quantity is required'],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'price is required'],
      trim: true,
      min: [1, 'Too short price'],
      max: [999999, 'Too long price'],
    },
    priceAfterDisc: {
      type: Number,
    },
    colors: {
      type: [String],
    },
    imageCover: {
      type: String,
      required: [true, 'image Cover is required'],
    },
    images: {
      type: [String],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'category',
      required: [true, 'product must belong to category'],
    },
    subcategory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subcategory',
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'brand',
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'rating must be greater than 0'],
      max: [5, 'rating must be less than or equal 5'],
      required: true,
    },
    rates: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
productShema.pre(/^find/, function (next) {
  this.populate([
    { path: 'category', select: 'name' },
    { path: 'subcategory', select: 'name' },
    { path: 'brand', select: 'name' },
  ]);
  next();
});
productShema.pre(/^create/, function (next) {
  this.populate([
    { path: 'category', select: 'name' },
    { path: 'subcategory', select: 'name' },
    { path: 'brand', select: 'name' },
  ]);
  next();
});

module.exports = mongoose.model('product', productShema);
