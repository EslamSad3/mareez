const express = require("express");
const { createCategory,getCategories,getCategory, updateCategory, deleteCategory } = require("./../services/categoryServices");
const router = express.Router();

router.route("/").get(getCategories).post(createCategory)

router.route("/:id").get(getCategory).put(updateCategory).delete(deleteCategory)
module.exports = router;
