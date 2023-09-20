const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const User = require('../models/userModel');

const createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRATION_TIME
  });

// @desc      Create User
// @route     POST /api/auth/signup
// @access    Public

exports.signup = asyncHandler(async (req, res, next) => {
  // 1- create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
  });
  // 2- Generate Web Token
  const token = createToken(user._id);
  res.status(201).json({ data: user, token });
});

// @desc      User Login
// @route     POST /api/auth/login
// @access    Public

exports.login = asyncHandler(async (req, res, next) => {
  // 1- check for email and password not empty
  // 2- check if user exists and password is correct
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError('Incorrect Email or Password',401));
  }
  // 3- generarate token
  const token = createToken(user._id);
  // 4- send res
  res.status(200).json({ data: user, token });
});


