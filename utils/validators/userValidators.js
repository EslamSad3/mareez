const User = require('../../models/userModel');
const slugify = require('slugify');
const { check } = require('express-validator');
const validatorMiddleWare = require('../../middlewares/validatorMiddleWare');

exports.getUserValidator = [
  check('id').isMongoId().withMessage('Invalid User ID Formate'),
  validatorMiddleWare,
];

exports.createUserValidator = [
  check('name')
    .notEmpty()
    .withMessage('Name Required')
    .isLength({ min: 2 })
    .withMessage('Too Short Name')
    .isLength({ max: 20 })
    .withMessage('Too Long Name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('email')
    .notEmpty()
    .withMessage('Email Required')
    .isEmail()
    .withMessage('Invalid Email')
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) {
        return Promise.reject(new Error('Email or phone Already Exists'));
      }
    }),
  check('password')
    .notEmpty()
    .withMessage('Password Required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .custom((password, { req }) => {
      if (password !== req.body.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  check('confirmPassword').notEmpty().withMessage('Confirm Password Required'),
  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA', 'ar-AE'])
    .withMessage('invalid phone number')
    .custom(async (val) => {
      const user = await User.findOne({ phone: val });
      if (user) {
        return Promise.reject(new Error('Email or phone Already Exists'));
      }
    }),
  check('profileImage').optional(),
  validatorMiddleWare,
];

exports.updateUserValidator = [
  check('id').isMongoId().withMessage('Invalid User ID Formate'),
  check('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleWare,
];

exports.deleteUserValidator = [
  check('id').isMongoId().withMessage('Invalid User ID Formate'),
  validatorMiddleWare,
];
