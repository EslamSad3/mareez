const User = require('../models/userModel');
const factory = require('./handlersFactory');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

// @desc      Add Product to wish list
// @route     POST /api/wishlist
// @access    private/protect/user

exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    message: 'Product added to your wishlist',
    data: user.wishlist,
  });
});

// @desc      Remove Product From wish list
// @route     DELETE /api/wishlist/:productId
// @access    private/protect/user
exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    message: 'Product Removed From your wishlist',
    data: user.wishlist,
  });
});

// @desc      Get Products From wish list
// @route     GET /api/wishlist
// @access    private/protect/user
exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.status(200).json({
    results: user.wishlist.length,
    status: 'success',
    data: user.wishlist,
  });
});
