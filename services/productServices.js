const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const Product = require('../models/productModel');
const ApiError = require('../utils/apiError');

// @desc      Create product
// @route     POST /api/products
// @access    private
exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  const product = await Product.create(req.body);
  res.status(201).json({ data: product });
});

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
  // 1- filtering
  const queryStringObj = { ...req.query };
  const excludedFileds = ['page', 'limit', 'skip', 'fileds'];
  excludedFileds.forEach((filed) => {
    delete queryStringObj[filed];
  });

  // 2- pagaination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  // Build mongoose query
  const mongooseQuery = Product.find(queryStringObj)
    .skip(skip)
    .limit(limit)
    .populate([
      { path: 'category', select: 'name' },
      { path: 'subcategory', select: 'name' },
      { path: 'brand', select: 'name' },
    ]);

  // Excute mongoose query
  const products = await mongooseQuery;
  res.status(200).json({ results: products.length, page, data: products });
});

// @desc      Update product
// @route     PUT /api/products/:id
// @access    private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) req.body.slug = slugify(req.body.title);

  const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!product) {
    return next(new ApiError(`No product For This id ${id}`, 404));
  }
  res.status(200).json({ data: product });
});

// @desc      Delete product
// @route     DELETE /api/products/:id
// @access    private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return next(new ApiError(`No product For This id ${id}`, 404));
  }
  res.status(204).send();
});
