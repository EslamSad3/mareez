const express = require('express');

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeCategoryImage,
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
    uploadCategoryImage,
    resizeCategoryImage,
    createCategoryValidator,
    createCategory
  );

router
  .route('/:id')
  .get(getCategoryValidator, getCategory)
  .patch(
    uploadCategoryImage,
    resizeCategoryImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(deleteCategoryValidator, deleteCategory);
module.exports = router;
