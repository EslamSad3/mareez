const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

// @desc      Add Address to user addresses list
// @route     POST /api/addresses
// @access    private/protect/user

exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body},
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    message: 'Address added to your Addresses list',
    data: user.addresses,
  });
});

// @desc      Remove Address From addresses list
// @route     DELETE /api/wishlist/:addressId
// @access    private/protect/user
exports.removeAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: {_id:req.params.addressId} },
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    message: 'Address Removed From your Addresses List',
    data: user.addresses,
  });
});

// @desc      Get Addresses From wish Addresses List
// @route     GET /api/addresses
// @access    private/protect/user
exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('addresses');
  res.status(200).json({
    results: user.addresses.length,
    status: 'success',
    data: user.addresses,
  });
});
