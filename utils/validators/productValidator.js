const slugify = require('slugify');
const { check } = require('express-validator');
const validatorMiddleWare = require('../../middlewares/validatorMiddleWare');
const Category = require('../../models/categoryModel');
const SubCategory = require('../../models/subCategoryModel');

exports.createProductValidator = [
  check('title')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
    .isLength({ min: 3 })
    .withMessage('Too Short Product Name')
    .notEmpty()
    .withMessage('Product title Required'),
  check('description')
    .notEmpty()
    .withMessage('Product Description is required')
    .isLength({ max: 10000 })
    .withMessage('Product Description is too long'),
  check('quantity')
    .notEmpty()
    .withMessage('product quantity is required')
    .isNumeric()
    .withMessage('product quantity must be a number'),
  check('sold')
    .optional()
    .isNumeric()
    .withMessage('product sold quantity must be a number'),
  check('price')
    .notEmpty()
    .withMessage('product price is required ')
    .isNumeric()
    .withMessage('product price must be a number')
    .isLength({ max: 32 }),
  check('priceAfterDisc')
    .optional()
    .isNumeric()
    .withMessage('price after discount must be a number')
    .toFloat()
    .custom((value, { req }) => {
      if (value >= req.body.price) {
        throw new Error('price after discount must be less than price');
      }
      return true;
    }),
  check('colors')
    .optional(),
  // check('imageCover').notEmpty().withMessage('image Cover is required'),
  check('images')
    .optional()
    .isArray()
    .withMessage('images must be an array of strings'),
  check('category')
    .notEmpty()
    .withMessage('Product must be belong to a category')
    .isMongoId()
    .withMessage('Invalid ID formate')
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category for this id: ${categoryId}`)
          );
        }
      })
    ),
  check('brand').optional().isMongoId().withMessage('invalid brand id format'),
  check('subcategories')
    .optional()
    .isMongoId()
    .withMessage('Invalid ID formate')
    .custom((subcategoriesIds) =>
      SubCategory.find({ _id: { $exists: true, $in: subcategoriesIds } }).then(
        (result) => {
          if (result.length < 1 || result.length !== subcategoriesIds.length) {
            return Promise.reject(new Error(`Invalid subcategories Ids`));
          }
        }
      )
    )
    .custom((val, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subcategories) => {
          const subCategoriesIdsInDB = [];
          subcategories.forEach((subcategory) => {
            subCategoriesIdsInDB.push(subcategory._id.toString());
          });
          const checker = (target, arr) => target.every((v) => arr.includes(v));
          if (!checker(val, subCategoriesIdsInDB)) {
            return Promise.reject(
              new Error(`SubCategories not belonging to this category`)
            );
          }
        }
      )
    ),
  check('rating')
    .optional()
    .isNumeric()
    .withMessage('rating must be a number')
    .isLength({ min: 0, max: 5 })
    .withMessage('rating must be between 0 and 5'),
  check('rates').optional().isNumeric().withMessage('rating must be a number'),
  validatorMiddleWare,
];

exports.getProductValidator = [
  check('id').isMongoId().withMessage('Invalid Product ID Formate'),
  validatorMiddleWare,
];

exports.updateProductValidator = [
  check('id').isMongoId().withMessage('Invalid Product ID Formate'),
  check('title')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleWare,
];

exports.deleteProductValidator = [
  check('id').isMongoId().withMessage('Invalid Product ID Formate'),
  validatorMiddleWare,
];
