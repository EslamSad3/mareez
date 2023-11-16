const express = require('express');
const auth = require('../services/authServices');

const {
  addToCart,
  getLoggedUserCart,
  deleteItemFromCart,
  deleteAllItemsFromCart,
  updateCartItemQuantity,
  applyCouponOnCart,
} = require('../services/cartServices');
const router = express.Router();
router.use(auth.protect, auth.allowedTo('user'));

router
  .route('/')
  .post(addToCart)
  .get(getLoggedUserCart)
  .delete(deleteAllItemsFromCart)
router.route("/apply-coupon").patch(applyCouponOnCart)
router.route('/:itemId').delete(deleteItemFromCart).patch(updateCartItemQuantity)


// router.route('/:id').get(getCoupon).patch(updateCoupon).delete(deleteCoupon);
module.exports = router;
