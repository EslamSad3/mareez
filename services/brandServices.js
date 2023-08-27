const Brand = require('../models/brandModel');
const factory = require('./handlersFactory');

// @desc      Create Brand
// @route     POST /api/brands
// @access    private
exports.createBrand = factory.create(Brand)

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
