const { check } = require('express-validator');
const Review = require('../../models/reviewModel');
const validatorMiddleWare = require('../../middlewares/validatorMiddleWare');
const User = require('../../models/userModel');

exports.createReviewValidator = [
  check('title').optional(),
  check('rating')
    .notEmpty()
    .withMessage('rating number require')
    .isFloat({ min: 1, max: 5 })
    .withMessage('rating value must be between 1-5'),
  check('user')
    .notEmpty()
    .withMessage('User Id required')
    .isMongoId()
    .withMessage('Invalid User ID Formate')
    // check if the logged user id = req.body.user
    .custom(async (val, { req }) => {
      const user = await User.findById(req.body.user);
      // console.log('user body', user._id);
      // console.log('logged user', req.user._id);
      if (user._id.toString() !== req.user._id.toString()) {
        return Promise.reject(new Error("You're not allowed"));
      }
      return true;
    }),
  check('product')
    .notEmpty()
    .withMessage('product Id required')
    .isMongoId()
    .withMessage('Invalid User ID Formate')
    .custom(async (val, { req }) => {
      // chech if logged user created review before
      const review = await Review.findOne({
        user: req.user._id,
        product: req.body.product,
      });
      if (review) {
        return Promise.reject(new Error('You Created Review Before'));
      }
      return review;
    }),

  validatorMiddleWare,
];
exports.getReviewValidator = [
  check('id').isMongoId().withMessage('Invalid Review ID Formate'),
  validatorMiddleWare,
];

exports.updateReviewValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid Review ID Formate')
    .custom(async (val, { req }) => {
      // check before updating
      const review = await Review.findById(val);
      if (!review) return Promise.reject(new Error('No Review for this ID'));
      if (!review.user._id.equals(req.user._id)) {
        //  or review.user._id.toString() !== req.user._id.toString()
        return Promise.reject(
          new Error("You're not allowed to access this action")
        );
      }
    }),

  validatorMiddleWare,
];

exports.deleteReviewValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid Review ID Formate')
    .custom(async (val, { req }) => {
      // console.log(req.user.role)
      if (req.user.role === 'user') {
        const review = await Review.findById(val);
        if (!review) return Promise.reject(new Error('No Review for this ID'));
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("You're not allowed to access this action")
          );
        }
      }
      return true;
    }),
  validatorMiddleWare,
];
