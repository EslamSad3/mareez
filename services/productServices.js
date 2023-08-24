const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeauters');
const factory = require('./handlersFactory');

// @desc      Create product
// @route     POST /api/products
// @access    private
exports.createProduct = factory.create(Product)

// @desc      Get Specific product by id
// @route     GET /api/products/:id
// @access    Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate([
    { path: 'category', select: 'name' },
    { path: 'subcategory', select: 'name' },
    { path: 'brand', select: 'name' },
  ]);
  if (!product) {
    return next(new ApiError(`No product For This id ${id}`, 404));
  }
  res.status(200).json({ data: product });
});

// @desc      Get List Of products
// @route     GET /api/products
// @access    Public
exports.getProducts = asyncHandler(async (req, res) => {
  // Build query
  const countDocuments = await Product.countDocuments();
  const apiFeauters = new ApiFeatures(Product.find(), req.query)
    .pagination(countDocuments)
    .filter()
    .search('Product')
    .limitFields()
    .sort();
  // Excute query
  const { mongooseQuery, paginateResult } = apiFeauters;
  const products = await mongooseQuery.populate([
    { path: 'category', select: 'name' },
    { path: 'subcategory', select: 'name' },
    { path: 'brand', select: 'name' },
  ]);
  res
    .status(200)
    .json({ results: products.length, paginateResult, data: products });
});

// @desc      Update product
// @route     PUT /api/products/:id
// @access    private
exports.updateProduct = factory.updateOne(Product);

// @desc      Delete product
// @route     DELETE /api/products/:id
// @access    private
exports.deleteProduct = factory.deleteOne(Product);
