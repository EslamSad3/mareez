const express = require('express');

// Services
const {
  signup,
  login,
  verifyPasswordResetCode,
  fogotPassword,
  resetPassword
} = require('../services/authServices');

// Validators
const {
  signUpValidator,
  loginValidator,
} = require('../utils/validators/authValidators');

const router = express.Router();

router.post('/signup', signUpValidator, signup);
router.route('/login').post(loginValidator, login);
router.post('/forgot-password', fogotPassword);
router.post('/reset-code', verifyPasswordResetCode);
router.patch('/reset-password', resetPassword);

module.exports = router;
