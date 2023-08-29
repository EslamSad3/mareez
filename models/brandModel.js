const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'brand Required'],
      unique: [true, 'brand must be unique'],
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

const setImageToUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

brandSchema.post('init', (doc) => {
  setImageToUrl(doc);
});
brandSchema.post('save', (doc) => {
  setImageToUrl(doc);
});

// create model
module.exports = mongoose.model('brand', brandSchema);
// const brandModel = mongoose.model('brand', brandSchema);
// module.exports = brandModel;
