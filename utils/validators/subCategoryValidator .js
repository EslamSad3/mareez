const slugify = require('slugify');
const { check, body } = require('express-validator');
const validatorMiddleWare = require('../../middlewares/validatorMiddleWare');

exports.getSubCategoryValidator = [
  check('id')
    .notEmpty()
    .withMessage('SubCategory Id Is required')
    .isMongoId()
    .withMessage('Invalid Category ID Formate'),
  validatorMiddleWare,
];

exports.createSubCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('category Required')
    .isLength({ min: 2 })
    .withMessage('Too Short Name')
    .isLength({ max: 20 })
    .withMessage('Too Long Name'),
  check('category')
    .notEmpty()
    .withMessage('Catgeory ID Required')
    .isMongoId()
    .withMessage('Invalid Category ID'),
  validatorMiddleWare,
];

exports.updateSubCategoryValidator = [
  check('id')
    .notEmpty()
    .withMessage('SubCategory id required')
    .isMongoId()
    .withMessage('Invalid Category ID Formate'),
  check('name')
    .notEmpty()
    .withMessage('category Required')
    .isLength({ min: 3 })
    .withMessage('Too Short Name')
    .isLength({ max: 20 })
    .withMessage('Too Long Name'),
  validatorMiddleWare,
];

exports.deleteSubCategoryValidator = [
  check('id')
    .notEmpty()
    .withMessage('SubCategory id required')
    .isMongoId()
    .withMessage('Invalid Category ID Formate'),
  validatorMiddleWare,
];
