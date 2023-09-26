const express = require('express');
const auth = require('../services/authServices');
const {
  createCashOrder,
  getAllOrders,
  getSpesificOrder,
  filterOrdersByLoggedUser,
} = require('../services/orderServices');
const router = express.Router();

router.use(auth.protect);
router.route('/:cartId').post(auth.allowedTo('user'), createCashOrder);
router
  .route('/')
  .get(auth.allowedTo('admin', 'user'), filterOrdersByLoggedUser, getAllOrders);
router.route('/:id').get(getSpesificOrder);

module.exports = router;
