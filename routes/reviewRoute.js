const express = require('express');
const auth = require('../services/authServices');

const {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  createFilterObj,
  setProductidAndUserToBody
} = require('../services/reviewServices');
const {
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
  getReviewValidator,
} = require('../utils/validators/reviewValidator');
// const {
//   getReviewValidator,
//   createBrandValidator,
//   updateBrandValidator,
//   deleteBrandValidator,
// } = require('../utils/validators/brandValidator');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(createFilterObj,getReviews)
  .post(
    auth.protect,
    auth.allowedTo('user'),
    setProductidAndUserToBody,
    createReviewValidator,
    createReview
  );
router
  .route('/:id')
  .get(getReviewValidator, getReview)
  .patch(
    auth.protect,
    auth.allowedTo('admin', 'user'),
    updateReviewValidator,
    updateReview
  )
  .delete(
    auth.protect,
    auth.allowedTo('admin', 'user'),
    deleteReviewValidator,
    deleteReview
  );
module.exports = router;
