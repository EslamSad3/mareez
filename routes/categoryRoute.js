const express = require('express');
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
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
  .post(createCategoryValidator, createCategory);

router
  .route('/:id')
  .get(getCategoryValidator, getCategory)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);
module.exports = router;
