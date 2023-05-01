const express = require("express");
const router = express.Router();
const payment = require("../controller/paymentController");
const auth = require("../middleware/auth");

/** Create new payment */
router.post("/new", auth.isAuthenticatedUser, payment.CreatePayment);

/** Get success transaction */
router.get("/paypal/execute-payment", payment.PaymentExecute);

/** Get cancelled transaction */
router.get("/paypal/cancel-payment", payment.PaymentCancel);

/** Get payment detail */
router.get("/detail/:id", auth.isAuthenticatedUser, payment.GetPaymentDetail);

/** Delete payment  */
router.delete("/delete/:id", auth.isAuthenticatedUser, payment.DeletePayment);

/** Get all payment */
router.get("/all", auth.isAuthenticatedUser, payment.GetAllPayment);

/** Get payment detail */
router.get("/user", auth.isAuthenticatedUser, payment.GetUserPayment);

module.exports = router;
