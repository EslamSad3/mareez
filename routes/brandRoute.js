const express = require('express');
const auth = require('../services/authServices');

const {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeBrandImage,
} = require('../services/brandServices');
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require('../utils/validators/brandValidator');

const router = express.Router();

router
  .route('/')
  .get(getBrands)
  .post(
    auth.protect,
    auth.allowedTo('admin'),
    uploadBrandImage,
    resizeBrandImage,
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
    resizeBrandImage,
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
