const User = require('../models/userModel');
const factory = require('./handlersFactory');

const asyncHandler = require('express-async-handler');
const { uploadSingleImage } = require('../middlewares/uploadImagesMiddleWare');
const { v4 } = require('uuid');
const sharp = require('sharp');
const ApiError = require('../utils/apiError');
const bcrypt = require('bcryptjs');

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
exports.updateUser = asyncHandler(async (req, res, next) => {
  const collection = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!collection) {
    return next(
      new ApiError(`No collection For This id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ data: collection });
});

exports.updateUserPassword = asyncHandler(async (req, res, next) => {
  const collection = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
    },
    {
      new: true,
    }
  );
  if (!collection) {
    return next(
      new ApiError(`No collection For This id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ data: collection });
});

// @desc      Delete User
// @route     DELETE /api/users/:id
// @access    private

exports.deleteUser = factory.deleteOne(User);
