const Product = require('../models/productModel');
const factory = require('./handlersFactory');
const { uploadMixOfFiles,
} = require('../middlewares/uploadImagesMiddleWare');
// upload images

exports.uploadProductImages = uploadMixOfFiles(
  [
    {
      name: 'imageCover',
      maxCount: 1,
    },
    { name: 'images', maxCount: 4 },
  ]
);



// @desc      Create product
// @route     POST /api/products
// @access    private
exports.createProduct = factory.create(Product);

// @desc      Get Specific product by id
// @route     GET /api/products/:id
// @access    Public
exports.getProduct = factory.getOne(Product, [
  { path: 'category', select: 'name' },
  { path: 'subcategory', select: 'name' },
  { path: 'brand', select: 'name' },
  { path: 'reviews' },
]);

// @desc      Get List Of products
// @route     GET /api/products
// @access    Public
exports.getProducts = factory.getAll(Product, 'Product');

// @desc      Update product
// @route     PATCH /api/products/:id
// @access    private
exports.updateProduct = factory.updateOne(Product);

// @desc      Delete product
// @route     DELETE /api/products/:id
// @access    private
exports.deleteProduct = factory.deleteOne(Product);

// .populate([
//   { path: 'category', select: 'name' },
//   { path: 'subcategory', select: 'name' },
//   { path: 'brand', select: 'name' },
// ]);

exports.averageRatings = Product.aggregate([
  { $match: { reviews: [] } },
  { $group: { _id: '__id', total: { $sum: '$rating' } } },
]);
