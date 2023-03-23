const express = require("express");
const router = express.Router();
const payment = require("../controller/paymentController");
const auth = require("../middleware/auth");

router.post("/new", auth.isAuthenticatedUser, payment.CreatePayment);

router.get("/paypal/execute-payment", payment.PaymentExecute);

router.get("/paypal/cancel-payment", payment.PaymentCancel);

router.get("/detail", auth.isAuthenticatedUser, payment.GetPaymentDetail);

module.exports = router;
