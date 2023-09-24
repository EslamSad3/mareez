const express = require('express');
const {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,
} = require('../services/addressesServices');
const auth = require('../services/authServices');
const router = express.Router();
router.use(auth.protect);
router.get('/', getLoggedUserAddresses).post('/', addAddress);
router.delete('/:addressId', removeAddress);
module.exports = router;
