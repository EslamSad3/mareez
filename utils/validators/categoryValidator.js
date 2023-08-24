const slugify = require('slugify');
const { check, body } = require('express-validator');
const validatorMiddleWare = require('../../middlewares/validatorMiddleWare');

exports.getCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid Category ID Formate'),
  validatorMiddleWare,
];

exports.createCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('category Required')
    .isLength({ min: 2 })
    .withMessage('Too Short Name')
    .isLength({ max: 20 })
    .withMessage('Too Long Name'),
  validatorMiddleWare,
];

exports.updateCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid Category ID Formate'),
  check('name')
    .notEmpty()
    .withMessage('category Required')
    .isLength({ min: 2 })
    .withMessage('Too Short Name')
    .isLength({ max: 20 })
    .withMessage('Too Long Name'),
  body('name').custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleWare,
];

exports.deleteCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid Category ID Formate'),
  validatorMiddleWare,
];
