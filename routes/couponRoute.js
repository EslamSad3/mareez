const express = require('express');
const auth = require('../services/authServices');

const {
  createCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} = require('../services/couponServices');
const router = express.Router();
router.use(auth.protect, auth.allowedTo('admin'));

router.route('/').get(getCoupons).post(createCoupon);
router.route('/:id').get(getCoupon).patch(updateCoupon).delete(deleteCoupon);
module.exports = router;
