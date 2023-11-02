const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require('express-async-handler');
const factory = require('./handlersFactory');
const ApiError = require('../utils/apiError');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const User = require('../models/userModel');
const Order = require('../models/orderModel');

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
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});
    // 5- clear cart Based On Cart ID
    await Cart.findByIdAndDelete(req.params.cartId);
  }
  res.status(200).json({ status: 'success', data: order });
});

// @desc    Get all Orders
// @route   GET /api/orders/
// @access  private/ User / admin
exports.filterOrdersByLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === 'user') req.filterObj = { user: req.user._id };
  next();
});
exports.getAllOrders = factory.getAll(Order);

// @desc    Get Spesific Order
// @route   GET /api/orders/:orderid
// @access  private/ User / admin

exports.getSpesificOrder = factory.getOne(Order);

// @desc    Update Order Status to Paid
// @route   PATCH /api/orders/:orderid/pay
// @access  private/ admin

exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError('No order Found For This ID', 404));
  }
  // update order to paid
  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();
  res.status(200).json({
    status: 'success',
    message: 'Order paid successfully',
    data: updatedOrder,
  });
});

// @desc    Update Order Status to delivered
// @route   PATCH /api/orders/:orderid/delivered
// @access  private/ admin

exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  req.params.id ? req.params.id : (req.params.id = req.body.id);
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError('No order Found For This ID', 404));
  }
  // update order to Delivered
  order.status = 'delivered';
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();
  res.status(200).json({
    status: 'success',
    message: 'Order Delivered successfully',
    data: updatedOrder,
  });
});

// @desc    Update Order Status to Shipping
// @route   PATCH /api/orders/:orderid/Shipping
// @access  private/ admin

exports.updateOrderState = asyncHandler(async (req, res, next) => {
  const { Orderstatus } = req.params;
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError('No order Found For This ID', 404));
  }
  console.log(req.params,'req.params');
  console.log(Orderstatus);
  // update order to Delivered
  order.status = Orderstatus;
  if (Orderstatus === 'delivered') {
    order.deliveredAt = Date.now();
  }

  const updatedOrder = await order.save();
  res.status(200).json({
    status: 'success',
    message: `Order is ${Orderstatus}`,
    data: updatedOrder,
  });
});

// @desc    GET CHeck out Session From Stripe And Send It As Response
// @route   GET /api/orders/check-out-session/:cartId
// @access  private/ user

exports.checkOutSession = asyncHandler(async (req, res, next) => {
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

  // 3- create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'sar',
          product_data: {
            name: req.user.name,
          },

          unit_amount: totalOrderPrice * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/api/orders`,
    cancel_url: `${req.protocol}://${req.get('host')}/api/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });
  res.status(200).json({ status: 'success', session });
});

const createCardOrder = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata;
  const orderPrice = session.amount_total / 100;

  const cart = await Cart.findById(cartId);
  const user = await User.findOne({ email: session.customer_email });

  // create Order With card
  const order = await Order.create({
    user: user._id,
    shippingAddress,
    cartItems: cart.cartItems,
    totalOrderPrice: orderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethod: 'card',
  });
  // after Creating Order, decrement Product Quantity and increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});
    // 5- clear cart Based On Cart ID
    await Cart.findByIdAndDelete(cartId);
  }
};

// @desc    This webhook will run when stripe payment successfully done
// @route   POST /webhook-checkout
// @access  private/ user

exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log('event', event);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    //  Create order
    console.log('create order');
    createCardOrder(event.data.object);
  }

  res.status(200).json({ received: true });
});

exports.deleteOrder = factory.deleteOne(Order);
