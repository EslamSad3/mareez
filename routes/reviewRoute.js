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
    auth.allowedTo('admin'),
    updateReviewValidator,
    updateReview
  )
  .delete(
    auth.protect,
    auth.allowedTo('admin'),
    deleteReviewValidator,
    deleteReview
  );
module.exports = router;
