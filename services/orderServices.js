const asyncHandler = require('express-async-handler');
const factory = require('./handlersFactory');
const ApiError = require('../utils/apiError');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');

// @desc    Create Cash Order
// @route   POST /api/orders/:cartId
// @access  private/ User

exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const texFees = 0;
  const shippingFees = 0;
  // 1- get Cart Based On Cart ID
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError('No Cart Found ', 404));
  }

  // 2- get Order Price Based On Cart Price (check if coupon applied)
  const cartPrice = cart.totalAfterDiscount
    ? cart.totalAfterDiscount
    : cart.total;
  const totalOrderPrice = cartPrice + texFees + shippingFees;
  // 3- create Order With default Payment Method cash
  const order = await Order.create({
    user: req.user._id,
    shippingAddress: req.body.shippingAddress,
    cartItems: cart.cartItems,
    totalOrderPrice,
  });
  // 4- after Creating Order, decrement Product Quantity and increment product sold
  // 5- clear cart Based On Cart ID
});
