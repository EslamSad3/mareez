const express = require('express');

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadSingleImage,
  resizeImage,
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
    uploadSingleImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  );

router
  .route('/:id')
  .get(getCategoryValidator, getCategory)
  .patch(
    uploadSingleImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(deleteCategoryValidator, deleteCategory);
module.exports = router;
