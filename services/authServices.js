const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const User = require('../models/userModel');

const createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRATION_TIME,
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
    return next(new ApiError('Incorrect Email or Password', 401));
  }
  // 3- generarate token
  const token = createToken(user._id);
  // 4- send res
  res.status(200).json({ data: user, token });
});

// @desc     Make Sure User Is Loggwed In
exports.protect = asyncHandler(async (req, res, next) => {
  // 1- check if token exists, if exists get it.
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new ApiError(
        `You're Not Logged In, Please Login to access this page.`,
        401
      )
    );
  }

  // 2- check if token is valid, no changes happened or expired.
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  // 3- check if user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(new ApiError(`User With This token does not exist`, 401));
  }
  // 4- check if password changed after token created
  if (currentUser.passwordChangedAt) {
    const passChangedTimeStamp = parseInt(
      currentUser.passwordChangedAt / 1000,
      10
    );
    // password changed after token created
    if (passChangedTimeStamp > decoded.iat) {
      return next(
        new ApiError(
          'Password changed after token created, please login again.',
          401
        )
      );
    }
  }
  req.user = currentUser;
  next();
});

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1- access Roles
    // 2- access logged In User (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(`You're Not Allowed TO access this route.`, 403)
      );
    }
    next();
  });
