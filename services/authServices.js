const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/userModel');
const { createToken } = require('../utils/createToken');
const { sanitizeUser } = require('../utils/sanitizeData');

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
  const token = createToken(user);
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
  const token = createToken(user);
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
  const currentUser = await User.findOne({ _id: decoded.payload._id });
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

// @desc     check who is allowed to access this route
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

// @desc      User Forgot Password
// @route     POST /api/auth/forgot-password
// @access    Public
exports.fogotPassword = asyncHandler(async (req, res, next) => {
  // 1- get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(
      new ApiError(`Email Address : ${req.body.email}  Not Found`),
      404
    );
  // 2- if user exists generate hashed code and save it to database
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');
  //  save hashed code to database
  user.passwordResetCode = hashedCode;
  // add expiration time for reset code 10min
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  // verfiy reset code
  user.passwordResetVerified = false;
  await user.save();
  // 3- send the reset code to email
  const message = `Hi ${user.name},\n We received your reset password request for Mareez-sa.com\n
  ${resetCode}\nPlease Note that Your reset Code valid for 10 minutes.
  `;
  try {
    await sendEmail({
      email: user.email,
      subject: `your password reset code (valid for 10 minutes) `,
      message,
    });
  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(new ApiError('Error Sending Email', 500));
  }
  res
    .status(200)
    .json({ status: 'success', message: 'reset code was sent successfully' });
});

// @desc      Verifiy Password Reset Code
// @route     POST /api/auth/reset-code
// @access    Public
exports.verifyPasswordResetCode = asyncHandler(async (req, res, next) => {
  //  1- get user based on password reset code
  const hashedCode = crypto
    .createHash('sha256')
    .update(req.body.resetCode)
    .digest('hex');
  const user = await User.findOne({
    passwordResetCode: hashedCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError('Invalid or expired password reset code'));
  }
  // 2- reset code valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({ status: 'SUCCESS' });
});

// @desc       Password Reset
// @route     POST /api/auth/reset-password
// @access    Public

exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1- Get User By Email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError('no user found', 404));
  }
  // 2- check if reset code verified
  if (!user.passwordResetVerified) {
    return next(new ApiError('Reset Code Not Verified', 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;
  await user.save();

  // 3- Generate New Token
  const token = createToken(user._id);
  res.status(200).json({ success: 'Password Changed Successfully', token });
});
