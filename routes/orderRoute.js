const express = require('express');
const auth = require('../services/authServices');
const {
  createCashOrder,
  getAllOrders,
  getSpesificOrder,
  filterOrdersByLoggedUser,
  updateOrderToDelivered,
  updateOrderToPaid,
} = require('../services/orderServices');
const router = express.Router();

router.use(auth.protect);
router.route('/:cartId').post(auth.allowedTo('user'), createCashOrder);
router
  .route('/')
  .get(auth.allowedTo('admin', 'user'), filterOrdersByLoggedUser, getAllOrders);
router.route('/:id').get(getSpesificOrder);

router.use(auth.allowedTo('admin'));
router.route('/:id/pay').patch(updateOrderToPaid);
router.route('/:id/delivered').patch(updateOrderToDelivered);

module.exports = router;
