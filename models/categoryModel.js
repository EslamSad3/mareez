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

// const setImageToUrl = (doc) => {
//   if (doc.image) {
//     const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
//     doc.image = imageUrl;
//   }
// };

// categorySchema.post('init', (doc) => {
//   setImageToUrl(doc);
// });
// categorySchema.post('save', (doc) => {
//   setImageToUrl(doc);
// });

// create model
module.exports = mongoose.model('category', categorySchema);
