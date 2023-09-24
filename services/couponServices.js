const Coupon = require('../models/couponModel');
const factory = require('./handlersFactory');

// @desc      Create Coupon
// @route     POST /api/coupons
// @access    private/Admin
exports.createCoupon = factory.create(Coupon);

// @desc      Get Specific Coupon by id
// @route     GET /api/coupons/:id
// @access    private/Admin
exports.getCoupon = factory.getOne(Coupon);

// @desc      Get List Of Coupons
// @route     GET /api/coupons
// @access    private/Admin
exports.getCoupons = factory.getAll(Coupon);

// @desc      Update Coupon
// @route     PATCH /api/coupons/:id
// @access    private/Admin
exports.updateCoupon = factory.updateOne(Coupon);

// @desc      Delete Coupon
// @route     DELETE /api/coupons/:id
// @access    private/Admin

exports.deleteCoupon = factory.deleteOne(Coupon);
