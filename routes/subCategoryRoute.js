const express = require('express');
const auth = require('../services/authServices');

const {
  createsubCategory,
  getSubCategory,
  getsubCategorires,
  updateSubCategory,
  deleteSubCategory,
  setCategoryidToBody,
} = require('../services/subCategoryServices');
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require('../utils/validators/subCategoryValidator ');
const { createSubCategoryFilterObj } = require('../middlewares/filterObjMiddleWare');
const productRoute = require('./productRoute')
const router = express.Router({ mergeParams: true });
router.use('/:subcategoryid/products', productRoute);
router
  .route('/')
  .post(
    setCategoryidToBody,
    auth.protect,
    auth.allowedTo('admin'),
    createSubCategoryValidator,
    createsubCategory
  )
  .get(createSubCategoryFilterObj, getsubCategorires);
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
