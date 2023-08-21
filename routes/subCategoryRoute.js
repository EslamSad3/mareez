const express = require("express");
const {
  createsubCategory,
  getSubCategory,
  getsubCategorires,
  updateSubCategory,
  deleteSubCategory,
} = require("../services/subCategoryServices");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator ");

const router = express.Router();
router
  .route("/")
  .post(createSubCategoryValidator, createsubCategory)
  .get(getsubCategorires);
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;
