const Brand = require('../models/brandModel');
const factory = require('./handlersFactory');

const asyncHandler = require('express-async-handler');
const { uploadSingleImage } = require('../middlewares/uploadImagesMiddleWare');
const { v4 } = require('uuid');
const sharp = require('sharp');



exports.uploadBrandImage = uploadSingleImage('image');
exports.resizeBrandImage = asyncHandler(async (req, res, next) => {
  const filename = `Brand-${Date.now()}-${v4()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`./uploads/brands/${filename}`);
  req.body.image = filename;
  next();
});


// @desc      Create Brand
// @route     POST /api/brands
// @access    private
exports.createBrand = factory.create(Brand);

// @desc      Get Specific Brand by id
// @route     GET /api/brands/:id
// @access    Public
exports.getBrand = factory.getOne(Brand);

// @desc      Get List Of Brands
// @route     GET /api/brands
// @access    Public
exports.getBrands = factory.getAll(Brand);

// @desc      Update Brand
// @route     PUT /api/brands/:id
// @access    private
exports.updateBrand = factory.updateOne(Brand);

// @desc      Delete Brand
// @route     DELETE /api/brands/:id
// @access    private

exports.deleteBrand = factory.deleteOne(Brand);
