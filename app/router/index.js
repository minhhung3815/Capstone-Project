const express = require("express");
const { error404Router } = require("../error/routerError");
const userRouter = require("./userRouter");
const appointmentRouter = require("./appointmentRouter");
const scheduleRouter = require("./scheduleRouter");
const requestRouter = require("./requestRouter");
const specializationRouter = require("./specializationRouter");
const roleRouter = require("./roleRouter");
const paymentRouter = require("./paymentRouter");
const medicineRouter = require("./medicineRouter");
const prescriptionRouter = require("./prescriptionRouter");
const router = express.Router();

router.use("/user", userRouter);

router.use("/request", requestRouter);

router.use("/appointment", appointmentRouter);

router.use("/schedule", scheduleRouter);

router.use("/specialization", specializationRouter);

router.use("/payment", paymentRouter);

router.use("/medicine", medicineRouter);

router.use("/role", roleRouter);

router.use("/prescription", prescriptionRouter);

router.use(error404Router);

module.exports = router;
