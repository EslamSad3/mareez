const { v4 } = require('uuid');
const { uploadSingleImage } = require('../middlewares/uploadImagesMiddleWare');
const factory = require('./handlersFactory');
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const SubCategory = require('../models/subCategoryModel');

exports.setCategoryidToBody = (req, res, next) => {
  // Nested Route
  if (!req.body.category) req.body.category = req.params.categoryid;
  next();
};

// upload single image

exports.uploadSubCategoryImage = uploadSingleImage('image');

exports.resizeSubCategoryImage = asyncHandler(async (req, res, next) => {
  const filename = `SubCategory-${Date.now()}-${v4()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`./uploads/subcategories/${filename}`);
  req.body.image = filename;
  next();
});

// @desc      Create subCategory
// @route     POST /api/subcategories
// @access    private
exports.createsubCategory = factory.create(SubCategory);

// Get subcategories by categoryid
exports.createFilterObj = (req, res, next) => {
  const filterObj = req.params.categoryid
    ? { category: req.params.categoryid }
    : {};
  req.filterObj = filterObj;
  next();
};

// @desc      Get List Of SubCategories
// @route     GET /api/subcategories
// @access    Public
exports.getsubCategorires = factory.getAll(SubCategory);

// @desc      Get Specific SubCategory by id
// @route     GET /api/subcategories/:id
// @access    Public
exports.getSubCategory = factory.getOne(SubCategory);
// @desc      Update subCategory
// @route     PATCH /api/subcategories/:id
// @access    private
exports.updateSubCategory = factory.updateOne(SubCategory);

// @desc      Delete subCategory
// @route     DELETE /api/subcategories/:id
// @access    private
exports.deleteSubCategory = factory.deleteOne(SubCategory);
