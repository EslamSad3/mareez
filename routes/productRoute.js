const express = require('express');
const auth = require('../services/authServices');

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  // resizeProductImages,
} = require('../services/productServices');
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require('../utils/validators/productValidator');

const reviewRoute = require('./reviewRoute');
const { createCategoryFilterObj, createSubCategoryFilterObj,createbrandFilterObj } = require('../middlewares/filterObjMiddleWare');





const router = express.Router({mergeParams:true});
router.use('/:productid/reviews', reviewRoute);
router
  .route('/')
  .get(createCategoryFilterObj,createSubCategoryFilterObj,createbrandFilterObj,getProducts)
  .post(
    auth.protect,
    auth.allowedTo('admin'),
    uploadProductImages,
    // resizeProductImages,
    createProductValidator,
    createProduct
  );

router
  .route('/:id')
  .get(getProductValidator, getProduct)
  .patch(
    auth.protect,
    auth.allowedTo('admin'),
    uploadProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(
    auth.protect,
    auth.allowedTo('admin'),
    deleteProductValidator,
    deleteProduct
  );
module.exports = router;
