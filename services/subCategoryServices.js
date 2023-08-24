const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const SubCategory = require('../models/subCategoryModel');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeauters');
const factory = require('./handlersFactory');

exports.getCategoryidToBody = (req, res, next) => {
  // Nested Route
  if (!req.body.category) req.body.category = req.params.categoryid;
  next();
};

// @desc      Create subCategory
// @route     POST /api/subcategories
// @access    private
exports.createsubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;
  const subCategory = await SubCategory.create({
    name,
    slug: slugify(name),
    category,
  });
  res.status(201).json({ data: subCategory });
});

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
exports.getsubCategorires = asyncHandler(async (req, res) => {
  // Build query
  const countDocuments = await SubCategory.countDocuments();
  const apiFeauters = new ApiFeatures(SubCategory.find(), req.query)
    .pagination(countDocuments)
    .filter()
    .search()
    .limitFields()
    .sort();
  // Excute query
  const { mongooseQuery, paginateResult } = apiFeauters;
  const subCategorires = await mongooseQuery.populate({
    path: 'category',
    select: 'name',
  });
  res.status(200).json({
    results: subCategorires.length,
    paginateResult,
    data: subCategorires,
  });
});

// @desc      Get Specific SubCategory by id
// @route     GET /api/subcategories/:id
// @access    Public
exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subcategory = await SubCategory.findById(id).populate({
    path: 'category',
    select: 'name',
  });
  if (!subcategory) {
    return next(new ApiError(`No SubCategory For This id ${id}`, 404));
  }
  res.status(200).json({ data: subcategory });
});

// @desc      Update subCategory
// @route     PUT /api/subcategories/:id
// @access    private
exports.updateSubCategory = factory.updateOne(SubCategory);

// @desc      Delete subCategory
// @route     DELETE /api/subcategories/:id
// @access    private
exports.deleteSubCategory = factory.deleteOne(SubCategory);