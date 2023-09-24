const express = require('express');
const auth = require('../services/authServices');

const {
  addToCart,
  getLoggedUserCart,
  deleteItemFromCart,
  deleteAllItemsFromCart,
} = require('../services/cartServices');
const router = express.Router();
router.use(auth.protect, auth.allowedTo('user'));

router
  .route('/')
  .post(addToCart)
  .get(getLoggedUserCart)
  .delete('/', deleteAllItemsFromCart);
router.delete('/:itemId', deleteItemFromCart);

// router.route('/:id').get(getCoupon).patch(updateCoupon).delete(deleteCoupon);
module.exports = router;
