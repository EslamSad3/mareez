const express = require('express');
const {
  createsubCategory,
  getSubCategory,
  getsubCategorires,
  updateSubCategory,
  deleteSubCategory,
  getCategoryidToBody,
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
  .post(getCategoryidToBody, createSubCategoryValidator, createsubCategory)
  .get(createFilterObj, getsubCategorires);
router
  .route('/:id')
  .get(getSubCategoryValidator, getSubCategory)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;
