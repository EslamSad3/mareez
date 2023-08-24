const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const Category = require('../models/categoryModel');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeauters');
const factory = require('./handlersFactory');

// @desc      Create Category
// @route     POST /api/categories
// @access    private
exports.createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  //async await
  const category = await Category.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
  // Category.create({name,slug:slugify(name)}).then(category =>res.status(201).json({data:category})).catch(err => res.status(400).send(err))
});

// @desc      Get Specific Category by id
// @route     GET /api/categories/:id
// @access    Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    // res.status(404).json({ msg: `No Category For This id ${id}` })
    return next(new ApiError(`No Category For This id ${id}`, 404));
  }
  res.status(200).json({ data: category });
});

// @desc      Get List Of Categories
// @route     GET /api/categories
// @access    Public
exports.getCategories = asyncHandler(async (req, res) => {
  // Build query
  const countDocuments = await Category.countDocuments();
  const apiFeauters = new ApiFeatures(Category.find(), req.query)
    .pagination(countDocuments)
    .filter()
    .search()
    .limitFields()
    .sort();
  // Excute query
  const { mongooseQuery, paginateResult } = apiFeauters;
  const categories = await mongooseQuery;
  res
    .status(200)
    .json({ results: categories.length, paginateResult, data: categories });
});

// @desc      Update Category
// @route     PUT /api/categories/:id
// @access    private
exports.updateCategory = factory.updateOne(Category);

// @desc      Delete Category
// @route     DELETE /api/categories/:id
// @access    private
exports.deleteCategory = factory.deleteOne(Category);
