const express = require('express');
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
  .post(uploadBrandImage, resizeBrandImage, createBrandValidator, createBrand);

router
  .route('/:id')
  .get(getBrandValidator, getBrand)
  .patch(uploadBrandImage, resizeBrandImage, updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);
module.exports = router;
