const express = require('express');
const auth = require('../services/authServices');

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
  .get(auth.protect, auth.allowedTo('admin'), getUsers)
  .post(
    auth.protect,
    auth.allowedTo('admin'),
    uploadUserImage,
    resizeUserImage,
    createUserValidator,
    createUser
  );

router
  .route('/change-password/:id')
  .patch(updateUserPasswordValidator, updateUserPassword);

router
  .route('/:id')
  .get(auth.protect, auth.allowedTo('admin'), getUserValidator, getUser)
  .patch(
    auth.protect,
    auth.allowedTo('admin'),
    uploadUserImage,
    resizeUserImage,
    updateUserValidator,
    updateUser
  )
  .delete(
    auth.protect,
    auth.allowedTo('admin'),
    deleteUserValidator,
    deleteUser
  );
module.exports = router;
