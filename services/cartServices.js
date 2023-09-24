const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');

const calcCartTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => (totalPrice += item.quantity * item.price));
  cart.total = totalPrice;
  return totalPrice;
};
// @desc      Add Product TO cart
// @route     POST /api/cart
// @access    Private/User

exports.addToCart = asyncHandler(async (req, res, next) => {
  const { productId, color, size } = req.body;
  const product = await Product.findById(productId);
  // 1- get logged in user cart
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    // if No cart Just Create New One with product
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, size, price: product.price }],
    });
  } else {
    // if product exists already in cart, update product quantity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    // console.log(productIndex)
    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      // cartItem.price = cartItem.quantity * cartItem.price
      cart.cartItems[productIndex] = cartItem;
    } else {
      // if product Not exists, push product to cart array
      cart.cartItems.push({
        product: productId,
        color,
        size,
        price: product.price,
      });
    }
  }

  // calc total cart price
  calcCartTotalPrice(cart);

  await cart.save();
  res.status(200).json({
    status: 'success',
    message: 'Product Added successfully',
    data: cart,
  });
});

// @desc      Get Logged In user Cart
// @route     GET /api/cart
// @access    Private/User

exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError('No Cart For This User', 404));
  }
  res
    .status(200)
    .json({ status: 'Success', results: cart.cartItems.length, data: cart });
});

// @desc      Delete item from  Cart
// @route     DELETE /api/cart/:itemId
// @access    Private/User

exports.deleteItemFromCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );
  calcCartTotalPrice(cart);
  cart.save();
  res.status(200).json({
    status: 'success',
    message: 'Product Removed From your Cart',
    data: cart,
  });
});

// @desc      Delete All items from  Cart
// @route     DELETE /api/car
// @access    Private/User

exports.deleteAllItemsFromCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).json({
    status: 'success',
    message: 'Cart Cleared successfully',
  });
});
