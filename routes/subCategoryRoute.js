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
  uploadSubCategoryImage,
  resizeSubCategoryImage,
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
    auth.protect,
    auth.allowedTo('admin'),
    setCategoryidToBody,
    uploadSubCategoryImage,
    resizeSubCategoryImage,
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
