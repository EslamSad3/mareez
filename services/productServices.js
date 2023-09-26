const Product = require('../models/productModel');
const factory = require('./handlersFactory');
const sharp = require('sharp');
const { v4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const {
  uploadMultipleImages,
} = require('../middlewares/uploadImagesMiddleWare');
// upload images

exports.uploadProductImages = uploadMultipleImages(
  [
    {
      name: 'imageCover',
      maxCount: 1,
    },
    { name: 'images', maxCount: 4 },
  ]
);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  // image cover
  if (req.files.imageCover) {
    const imageCoverfilename = `Products-${Date.now()}-${v4()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`./uploads/products/${imageCoverfilename}`);
    req.body.imageCover = imageCoverfilename;
  }
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imagesfilename = `Products-${Date.now()}-${v4()}-${
          index + 1
        }.jpeg`;
        await sharp(img.buffer)
          .resize(600, 600)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`./uploads/products/${imagesfilename}`);
        req.body.images.push(imagesfilename);
      })
    );
  }
  next();
});

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
