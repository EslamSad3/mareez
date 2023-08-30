const User = require('../models/userModel');
const factory = require('./handlersFactory');

const asyncHandler = require('express-async-handler');
const { uploadSingleImage } = require('../middlewares/uploadImagesMiddleWare');
const { v4 } = require('uuid');
const sharp = require('sharp');

exports.uploadUserImage = uploadSingleImage('profileImg');
exports.resizeUserImage = asyncHandler(async (req, res, next) => {
  const filename = `User-${Date.now()}-${v4()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`./uploads/users/${filename}`);
    req.body.profileImg = filename;
}
next();
});

// @desc      Create User
// @route     POST /api/users
// @access    private
exports.createUser = factory.create(User);

// @desc      Get Specific User by id
// @route     GET /api/users/:id
// @access    private
exports.getUser = factory.getOne(User);

// @desc      Get List Of Users
// @route     GET /api/users
// @access    private
exports.getUsers = factory.getAll(User);

// @desc      Update User
// @route     PUT /api/users/:id
// @access    private
exports.updateUser = factory.updateOne(User);

// @desc      Delete User
// @route     DELETE /api/users/:id
// @access    private

exports.deleteUser = factory.deleteOne(User);
