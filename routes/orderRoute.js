const express = require('express');
const auth = require('../services/authServices');
const { createCashOrder } = require('../services/orderServices');
const router = express.Router();

router.use(auth.protect, auth.allowedTo('user'));
router.route('/:cartId').post(createCashOrder);

module.exports = router;
