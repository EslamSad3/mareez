const Category = require('../models/categoryModel');
const factory = require('./handlersFactory');
const asyncHandler = require('express-async-handler');
const { uploadSingleImage } = require('../middlewares/uploadImagesMiddleWare');
const { v4 } = require('uuid');
const sharp = require('sharp');

exports.uploadCategoryImage = uploadSingleImage('image');

exports.resizeCategoryImage = asyncHandler(async (req, res, next) => {
  const filename = `Category-${Date.now()}-${v4()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`./uploads/categories/${filename}`);
    req.body.image = filename;
  }
  next();
});

// @desc      Create Category
// @route     POST /api/categories
// @access    private
exports.createCategory = factory.create(Category);

// @desc      Get Specific Category by id
// @route     GET /api/categories/:id
// @access    Public
exports.getCategory = factory.getOne(Category);

// @desc      Get List Of Categories
// @route     GET /api/categories
// @access    Public
exports.getCategories = factory.getAll(Category);

// @desc      Update Category
// @route     PUT /api/categories/:id
// @access    private
exports.updateCategory = factory.updateOne(Category);

// @desc      Delete Category
// @route     DELETE /api/categories/:id
// @access    private
exports.deleteCategory = factory.deleteOne(Category);
