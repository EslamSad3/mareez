const multer = require('multer');
const { v4 } = require('uuid');
const sharp = require('sharp');

const Category = require('../models/categoryModel');
const factory = require('./handlersFactory');
const ApiError = require('../utils/apiError');
const asyncHandler = require('express-async-handler');

// Disk Storage - Images
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './uploads/categories');
//   },
//   filename: function (req, file, cb) {
//     const ext = file.mimetype.split('/')[1];
//     const date = new Date().toLocaleDateString().split('/').join('-');
//     const filename = `Category-${date}-${v4()}.${ext}`;
//     cb(null, filename);
//   },
// });
// const multerFIlter = function (req, file, cb) {
//   if(file.mimetype.startsWith('image')){
//     cb(null,true)
//   } else{
//     cb(new ApiError('Only Images Allowed',400),false)
//   }
// };

console.log('*****************************');
// Memory Storage
const storage = multer.memoryStorage();
const multerFIlter = function (req, file, cb) {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new ApiError('Only Images Allowed', 400), false);
  }
};
const upload = multer({ storage: storage, fileFilter: multerFIlter });
exports.uploadSingleImage = upload.single('image');
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `Category-${Date.now()}-${v4()}.jpeg`;
  console.log(req.file);
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`./uploads/categories/${filename}`);
  req.body.image = filename;
  next();
});

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
// @route     PUT /api/categories/:id
// @access    private
exports.updateCategory = factory.updateOne(Category);

// @desc      Delete Category
// @route     DELETE /api/categories/:id
// @access    private
exports.deleteCategory = factory.deleteOne(Category);
