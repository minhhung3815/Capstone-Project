const express = require("express");
const router = express.Router();
const appointment = require("../controller/appointmentController");
const auth = require("../middleware/auth");

router.get("/all", auth.isAuthenticatedUser, appointment.ViewAllAppointment);

router.post("/new", auth.isAuthenticatedUser, appointment.MakeAppointment);

router.put(
  "/update/status",
  auth.isAuthenticatedUser,
  appointment.UpdateAppointment,
);

module.exports = router;
