const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'category Required'],
      unique: [true, 'category must be unique'],
      minlength: [3, 'Too Short Name'],
      maxlength: [20, 'Too Long Name'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

// create model

const CategoryModel = mongoose.model('category', categorySchema);

module.exports = CategoryModel;
