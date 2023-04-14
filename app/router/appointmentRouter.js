const express = require("express");
const router = express.Router();
const appointment = require("../controller/appointmentController");
const auth = require("../middleware/auth");

/** View all appointment */
router.get("/all", auth.isAuthenticatedUser, appointment.ViewAllAppointment);

/** Create new appointment */
router.post("/new", auth.isAuthenticatedUser, appointment.MakeAppointment);

/** Update appointment status */
router.put(
  "/update/status/:id",
  auth.isAuthenticatedUser,
  appointment.UpdateAppointment,
);

/** View specific appointment */
router.get(
  "/specific/:id",
  auth.isAuthenticatedUser,
  appointment.ViewSpecificAppointment,
);

/** View all user's appointments */
router.get(
  "/user/:id",
  auth.isAuthenticatedUser,
  appointment.UserViewAllAppointments,
);

/** View all doctor's appointments */
router.get(
  "/doctor/:id",
  auth.isAuthenticatedUser,
  appointment.DoctorViewAllAppointments,
);

/** Patient cancel appointment */
router.put(
  "/cancel/:id",
  auth.isAuthenticatedUser,
  appointment.CancelAppointment,
);

/** Patient update appointment */
router.put(
  "/update/:id",
  auth.isAuthenticatedUser,
  appointment.UpdateNewAppointment,
);

module.exports = router;
