const express = require('express');
const auth = require('../services/authServices');

const {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
} = require('../services/reviewServices');
// const {
//   getReviewValidator,
//   createBrandValidator,
//   updateBrandValidator,
//   deleteBrandValidator,
// } = require('../utils/validators/brandValidator');

const router = express.Router();

router
  .route('/')
  .get(getReviews)
  .post(auth.protect, auth.allowedTo('user'), createReview);
router
  .route('/:id')
  .get(getReview)
  .patch(auth.protect,auth.allowedTo('admin',"user"),updateReview)
  .delete(auth.protect,auth.allowedTo('admin',"user"), deleteReview);
module.exports = router;
