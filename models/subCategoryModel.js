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
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

// const setImageToUrl = (doc) => {
//   if (doc.image) {
//     const imageUrl = `${process.env.BASE_URL}/subcategories/${doc.image}`;
//     doc.image = imageUrl;
//   }
// };

// subCategorySchema.post('init', (doc) => {
//   setImageToUrl(doc);
// });
// subCategorySchema.post('save', (doc) => {
//   setImageToUrl(doc);
// });

module.exports = mongoose.model('subcategory', subCategorySchema);
