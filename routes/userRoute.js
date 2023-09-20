const express = require('express');

// Services
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateUserPassword,
  deleteUser,
  uploadUserImage,
  resizeUserImage,
} = require('../services/userServices');

// Validators
const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  updateUserPasswordValidator,
  deleteUserValidator,
} = require('../utils/validators/userValidators');

const router = express.Router();

router
  .route('/')
  .get(getUsers)
  .post(uploadUserImage, resizeUserImage, createUserValidator, createUser);

router
  .route('/change-password/:id')
  .patch(updateUserPasswordValidator, updateUserPassword);
router
  .route('/:id')
  .get(getUserValidator, getUser)
  .patch(uploadUserImage, resizeUserImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);
module.exports = router;
