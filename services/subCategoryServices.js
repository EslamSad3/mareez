const SubCategory = require('../models/subCategoryModel');
const factory = require('./handlersFactory');

exports.getCategoryidToBody = (req, res, next) => {
  // Nested Route
  if (!req.body.category) req.body.category = req.params.categoryid;
  next();
};

// @desc      Create subCategory
// @route     POST /api/subcategories
// @access    private
exports.createsubCategory = factory.create(SubCategory);

// Get subcategories by categoryid
exports.createFilterObj = (req, res, next) => {
  const filterObj = req.params.categoryid
    ? { category: req.params.categoryid }
    : {};
  req.filterObj = filterObj;
  next();
};

// @desc      Get List Of SubCategories
// @route     GET /api/subcategories
// @access    Public
exports.getsubCategorires = factory.getAll(SubCategory);

// @desc      Get Specific SubCategory by id
// @route     GET /api/subcategories/:id
// @access    Public
exports.getSubCategory = factory.getOne(SubCategory);
// @desc      Update subCategory
// @route     PUT /api/subcategories/:id
// @access    private
exports.updateSubCategory = factory.updateOne(SubCategory);

// @desc      Delete subCategory
// @route     DELETE /api/subcategories/:id
// @access    private
exports.deleteSubCategory = factory.deleteOne(SubCategory);
