const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'SubCategory is Required'],
      unique: [true, 'SubCategory Must Be Unique'],
      minlength: [2, 'To Short SubCategory Name'],
      maxlength: [20, 'To Long SubCategory Name'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'category',
      required: [true, 'SubCategory must have parent category'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('subcategory', subCategorySchema);
