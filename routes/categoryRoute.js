const express = require('express');
const auth = require('../services/authServices');

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage
  // resizeCategoryImage,
} = require('../services/categoryServices');
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require('../utils/validators/categoryValidator');

const subCategoriesRoute = require('./subCategoryRoute');

const router = express.Router();
router.use('/:categoryid/subcategories', subCategoriesRoute);

router
  .route('/')
  .get(getCategories)
  .post(
    auth.protect,
    auth.allowedTo('admin'),
    uploadCategoryImage,
    createCategoryValidator,
    createCategory
  );

router
  .route('/:id')
  .get(getCategoryValidator, getCategory)
  .patch(
    auth.protect,
    auth.allowedTo('admin'),
    uploadCategoryImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    auth.protect,
    auth.allowedTo('admin'),
    deleteCategoryValidator,
    deleteCategory
  );
module.exports = router;
