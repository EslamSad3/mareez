const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const SubCategory = require("../models/subCategoryModel");
const ApiError = require("../utils/apiError");

// @desc      Create subCategory
// @route     POST /api/subcategories
// @access    private
exports.createsubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;
  const subCategory = await SubCategory.create({
    name,
    slug: slugify(name),
    category,
  });
  res.status(201).json({ data: subCategory });
});

// @desc      Get List Of SubCategories
// @route     GET /api/subcategories
// @access    Public
exports.getsubCategorires = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 30;
  const skip = (page - 1) * limit;
  const subCategorires = await SubCategory.find({}).skip(skip).limit(limit);
  res
    .status(200)
    .json({ results: subCategorires.length, page, data: subCategorires });
});

// @desc      Get Specific SubCategory by id
// @route     GET /api/subcategories/:id
// @access    Public
exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subcategory = await SubCategory.findById(id);
  if (!subcategory) {
    return next(new ApiError(`No SubCategory For This id ${id}`, 404));
  }
  res.status(200).json({ data: subcategory });
});


// @desc      Update subCategory
// @route     PUT /api/subcategories/:id
// @access    private
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name,category } = req.body;
  const subCategory = await SubCategory.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) ,category},
    { new: true }
  );
  if (!subCategory) {
    return next(new ApiError(`No subCategory For This id ${id}`, 404));
  }
  res.status(200).json({ data: subCategory });
});

// @desc      Delete subCategory
// @route     DELETE /api/subcategories/:id
// @access    private
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findByIdAndDelete(id);
  if (!subCategory) {
    return next(new ApiError(`No subCategory For This id ${id}`, 404));
  }
  res.status(204).send();
});
