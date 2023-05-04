const express = require("express");
const router = express.Router();
const appointment = require("../controller/appointmentController");
const auth = require("../middleware/auth");

/** View all appointment */
router.get("/all", auth.isAuthenticatedUser, appointment.ViewAllAppointment);

/** Create new appointment */
router.post("/new", auth.isAuthenticatedUser, appointment.MakeAppointment);

/** Delete appointment */
router.delete(
  "/delete/:id",
  auth.isAuthenticatedUser,
  appointment.DeleteAppointment,
);

/** Create new appointment by ADMIN */
router.post(
  "/admin/new",
  auth.isAuthenticatedUser,
  appointment.MakeAdminAppointment,
);

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
  "/user/all",
  auth.isAuthenticatedUser,
  appointment.UserViewAllAppointments,
);

/** View all doctor's appointments */
router.get(
  "/doctor/all",
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

router.get(
  "/doctor/slot/:id/:date",
  auth.isAuthenticatedUser,
  appointment.GetAppointmentSlot,
);
module.exports = router;
