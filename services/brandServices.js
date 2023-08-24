const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const Brand = require('../models/brandModel');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeauters');
const factory = require('./handlersFactory');

// @desc      Create Brand
// @route     POST /api/brands
// @access    private
exports.createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const brand = await Brand.create({ name, slug: slugify(name) });
  res.status(201).json({ data: brand });
});

// @desc      Get Specific Brand by id
// @route     GET /api/brands/:id
// @access    Public
exports.getBrand = factory.getOne(Brand)

// @desc      Get List Of Brands
// @route     GET /api/brands
// @access    Public
exports.getBrands = factory.getAll(Brand)

// @desc      Update Brand
// @route     PUT /api/brands/:id
// @access    private
exports.updateBrand = factory.updateOne(Brand)

// @desc      Delete Brand
// @route     DELETE /api/brands/:id
// @access    private

exports.deleteBrand = factory.deleteOne(Brand);
