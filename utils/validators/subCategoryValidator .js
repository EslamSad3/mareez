const slugify = require('slugify');
const { check } = require('express-validator');
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
    .withMessage('SubCategory name Required')
    .isLength({ min: 2 })
    .withMessage('Too Short Name')
    .isLength({ max: 20 })
    .withMessage('Too Long Name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('category')
    .notEmpty()
    .withMessage('Catgeory ID Required')
    .isMongoId()
    .withMessage('Invalid Category ID'),
  validatorMiddleWare,
];

exports.updateSubCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid SubCategory ID Formate'),
  check('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
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
