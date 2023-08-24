const express = require('express');
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require('../services/productServices');
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require('../utils/validators/productValidator');

const router = express.Router();

router.route('/').get(getProducts).post(createProductValidator, createProduct);

router
  .route('/:id')
  .get(getProductValidator, getProduct)
  .put(updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);
module.exports = router;
