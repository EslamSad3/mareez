const express = require('express');
const auth = require('../services/authServices');
const {
  createCashOrder,
  getAllOrders,
  getSpesificOrder,
  filterOrdersByLoggedUser,

  updateOrderToPaid,
  checkOutSession,
  deleteOrder,

  updateOrderState,
} = require('../services/orderServices');
const router = express.Router();

router.use(auth.protect);

router.get(
  '/check-out-session/:cartId',
  auth.allowedTo('user'),
  checkOutSession
);
router.route('/:cartId').post(auth.allowedTo('user'), createCashOrder);
router
  .route('/')
  .get(auth.allowedTo('admin', 'user'), filterOrdersByLoggedUser, getAllOrders);
router.route('/:id').get(getSpesificOrder);

router.use(auth.allowedTo('admin'));
router.route('/:id/pay').patch(updateOrderToPaid);
router.route('/:id/:Orderstatus').patch(updateOrderState);
router.route('/:id').delete(deleteOrder);

module.exports = router;
