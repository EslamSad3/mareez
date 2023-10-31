const express = require('express');
const auth = require('../services/authServices');

const {
  createsubCategory,
  getSubCategory,
  getsubCategorires,
  updateSubCategory,
  deleteSubCategory,
  setCategoryidToBody,
  createFilterObj,
} = require('../services/subCategoryServices');
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require('../utils/validators/subCategoryValidator ');

const router = express.Router({ mergeParams: true });
router
  .route('/')
  .post(
    setCategoryidToBody,
    auth.protect,
    auth.allowedTo('admin'),
    createSubCategoryValidator,
    createsubCategory
  )
  .get(createFilterObj, getsubCategorires);
router
  .route('/:id')
  .get(getSubCategoryValidator, getSubCategory)
  .patch(
    auth.protect,
    auth.allowedTo('admin'),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    auth.protect,
    auth.allowedTo('admin'),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

module.exports = router;
