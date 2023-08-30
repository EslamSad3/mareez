const express = require('express');

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
const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
} = require('../utils/validators/userValidators');

const router = express.Router();

router
  .route('/')
  .get(getUsers)
  .post(uploadUserImage, resizeUserImage, createUserValidator, createUser);

router.route('/change-password/:id').patch(updateUserPassword);
router
  .route('/:id')
  .get(getUserValidator, getUser)
  .patch(uploadUserImage, resizeUserImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);
module.exports = router;
