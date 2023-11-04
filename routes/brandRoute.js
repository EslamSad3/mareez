const express = require('express');
const auth = require('../services/authServices');
const productRoute = require('./productRoute');
const {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
} = require('../services/brandServices');
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require('../utils/validators/brandValidator');

const router = express.Router();
router.use('/:brandid/products', productRoute);

router
  .route('/')
  .get(getBrands)
  .post(
    auth.protect,
    auth.allowedTo('admin'),
    uploadBrandImage,
    createBrandValidator,
    createBrand
  );

router
  .route('/:id')
  .get(getBrandValidator, getBrand)
  .patch(
    auth.protect,
    auth.allowedTo('admin'),
    uploadBrandImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    auth.protect,
    auth.allowedTo('admin'),
    deleteBrandValidator,
    deleteBrand
  );
module.exports = router;
