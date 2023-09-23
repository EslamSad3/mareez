const Review = require('../models/reviewModel');
const factory = require('./handlersFactory');




// Get subcategories by categoryid
exports.createFilterObj = (req, res, next) => {
    const filterObj = req.params.productid
      ? { product: req.params.productid }
      : {};
    req.filterObj = filterObj;
    next();
  };


  exports.setProductidAndUserToBody = (req, res, next) => {
    // Nested Route
    if (!req.body.product) req.body.product = req.params.productid;
    if (!req.body.user) req.body.user = req.user._id;
    next();
  };
// @desc      Create Review
// @route     POST /api/reviews
// @access    Private/protect/user
exports.createReview = factory.create(Review);

// @desc      Get Specific Review by id
// @route     GET /api/reviews/:id
// @access    Public
exports.getReview = factory.getOne(Review);

// @desc      Get List Of Reviews
// @route     GET /api/reviews
// @access    Public
exports.getReviews = factory.getAll(Review);

// @desc      Update Review
// @route     PUT /api/reviews/:id
// @access    Private/protect/user
exports.updateReview = factory.updateOne(Review);

// @desc      Delete Review
// @route     DELETE /api/reviews/:id
// @access    Private/protect/user

exports.deleteReview = factory.deleteOne(Review);
