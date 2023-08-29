const multer = require('multer');
const Product = require('../models/productModel');
const factory = require('./handlersFactory');
const ApiError = require('../utils/apiError');
const sharp = require('sharp');
const { v4 } = require('uuid');
const asyncHandler = require('express-async-handler');

// upload images

const storage = multer.memoryStorage();
const multerFIlter = function (req, file, cb) {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new ApiError('Only Images Allowed', 400), false);
  }
};
const upload = multer({ storage: storage, fileFilter: multerFIlter });
exports.uploadProductImages = upload.fields([
  {
    name: 'imageCover',
    maxCount: 1,
  },
  { name: 'images', maxCount: 4 },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  const imageCoverfilename = `Products-${Date.now()}-${v4()}-cover.jpeg`;
  // image cover
  if (req.files.imageCover) {
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`./uploads/products/${imageCoverfilename}`);
    req.body.imageCover = imageCoverfilename;
    next();
  }
  // if (req.files.images) {
  //   req.body.images = [];
  //   for (let i = 0; i < req.files.images.length; i++) {
  //     const imagesfilename = `Products-${Date.now()}-${v4()}-${i}.jpeg`;
  //     await sharp(req.files.images[i].buffer)
  //       .resize(600, 600)
  //       .toFormat('jpeg')
  //       .jpeg({ quality: 90 })
  //       .toFile(`./uploads/products/${imagesfilename}`);
  //     req.body.images.push(imagesfilename);
  //   }
  //   next();
  // }
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
    next();
  }
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
]);

// @desc      Get List Of products
// @route     GET /api/products
// @access    Public
exports.getProducts = factory.getAll(Product, 'Product');

// @desc      Update product
// @route     PUT /api/products/:id
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
