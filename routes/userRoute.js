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
  // resizeUserImage,
  getLoggedUserData,
  changeLoggedUserPassword,
  updateProfile,
  deActivateProfile,
  // reActivateProfile,
} = require('../services/userServices');
const auth = require('../services/authServices');
// Validators
const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  updateUserPasswordValidator,
  deleteUserValidator,
  updateLoggedUserValidator,
} = require('../utils/validators/userValidators');
const router = express.Router();

// User Routes
router.use(auth.protect)
router.get('/my-details', getLoggedUserData, getUser);
router.patch('/change-password', changeLoggedUserPassword);
router.patch('/update-profile', updateLoggedUserValidator, updateProfile);
router.delete('/dactivate-profile', deActivateProfile);
// router.patch('/ractivate-profile', reActivateProfile);

// Admin routes
router.use(auth.protect,auth.allowedTo('admin'));
router
  .route('/change-password/:id')
  .patch(updateUserPasswordValidator, updateUserPassword);
router
  .route('/')
  .get(getUsers)
  // .post(uploadUserImage, resizeUserImage, createUserValidator, createUser);
router
  .route('/:id')
  .get(getUserValidator, getUser)
  // .patch(uploadUserImage, resizeUserImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);
module.exports = router;
