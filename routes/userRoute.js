const express = require('express');

const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeUserImage,
} = require('../services/userServices');

const router = express.Router();

router
  .route('/')
  .get(getUsers)
  .post(uploadUserImage,resizeUserImage,createUser);

router
  .route('/:id')
  .get(getUser)
  .patch(uploadUserImage,resizeUserImage, updateUser)
  .delete(deleteUser);
module.exports = router;
