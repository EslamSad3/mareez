const express = require('express');

// Services
const { signup, login } = require('../services/authServices');

// Validators
const {
  signUpValidator,
  loginValidator,
} = require('../utils/validators/authValidators');

const router = express.Router();

router.route('/signup').post(signUpValidator, signup);
router.route('/login').post(loginValidator, login);

module.exports = router;
