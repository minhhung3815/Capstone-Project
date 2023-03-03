const express = require('express');
const router = express.Router();
const payment = require('../controller/paymentController');

router.post('/new', payment.CreatPayment);

router.get('/detail', payment.GetPaymentDetail);

module.exports = router;
