const express = require('express');
const {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
} = require('../services/wishListServices');
const auth = require('../services/authServices');
const router = express.Router();
router.use(auth.protect);
router.get('/', getLoggedUserWishlist).post('/', addProductToWishlist);
router.delete('/:productId', removeProductFromWishlist);
module.exports = router;
