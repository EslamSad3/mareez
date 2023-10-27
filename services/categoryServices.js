const Category = require('../models/categoryModel');
const factory = require('./handlersFactory');

const {  uploadMixOfFiles } = require('../middlewares/uploadImagesMiddleWare');
// upload images

exports.uploadCategoryImage = uploadMixOfFiles(
  [

    { name: 'image', maxCount: 1 },
  ]
);

// @desc      Create Category
// @route     POST /api/categories
// @access    private
exports.createCategory = factory.create(Category);

// @desc      Get Specific Category by id
// @route     GET /api/categories/:id
// @access    Public
exports.getCategory = factory.getOne(Category);

// @desc      Get List Of Categories
// @route     GET /api/categories
// @access    Public
exports.getCategories = factory.getAll(Category);

// @desc      Update Category
// @route     PATCH /api/categories/:id
// @access    private
exports.updateCategory = factory.updateOne(Category);

// @desc      Delete Category
// @route     DELETE /api/categories/:id
// @access    private
exports.deleteCategory = factory.deleteOne(Category);
