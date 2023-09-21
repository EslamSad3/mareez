const User = require('../models/userModel');
const factory = require('./handlersFactory');

const asyncHandler = require('express-async-handler');
const { uploadSingleImage } = require('../middlewares/uploadImagesMiddleWare');
const { v4 } = require('uuid');
const sharp = require('sharp');
const ApiError = require('../utils/apiError');
const bcrypt = require('bcryptjs');
const { createToken } = require('../utils/createToken');

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

//  Admin Services

//  ################################################

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

// @desc      Update User Password
// @route     PUT /api/users/change-password/:id
// @access    private

exports.updateUserPassword = asyncHandler(async (req, res, next) => {
  const collection = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
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

// #############################################

//  User Services

// @desc      Logged in user Data
// @route     GET /api/users/my-details
// @access    Public/protect

exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc      Update Logged in user Password
// @route     PATCH /api/users/update-password
// @access    Public/protect

exports.changeLoggedUserPassword = asyncHandler(async (req, res, next) => {
  // 1- update User Password Based on User Payload ( req.user._id)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  // 2- Generate User Token
  const token = createToken(user._id);
  res.status(200).json({ data: user, token });
});

// @desc      Update Logged in user profile (without password, role)
// @route     PATCH /api/users/update-profile
// @access    Public/protect

exports.updateProfile = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      // profileImg: req.body.profileImg,
    },
    { new: true }
  );
  res.status(200).json({ data: updatedUser });
});

// @desc      Deactivate Logged in user
// @route     DELETE /api/users/dactivate-profile
// @access    Public/protect

exports.deActivateProfile = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, {
    active: false,
  });
  res.status(204).send();
});

// // @desc      Reactivate deactivated user
// // @route     PATCH /api/users/reactivate-profile
// // @access    Public/protect
// exports.reActivateProfile = asyncHandler(async (req, res, next) => {
//   await User.findById(req.user._id, {
//     active: true,
//   });
//   res.status(200).json({ success: 'Account ReActivated' });
// });
