const express = require("express");
const router = express.Router();
const schedule = require("../controller/scheduleController");
const auth = require("../middleware/auth");

/** Get all doctor schedule */
router.get("/all", auth.isAuthenticatedUser, schedule.ViewAllSchedule);

/** Create new schedule */
router.post("/new", auth.isAuthenticatedUser, schedule.CreateDoctorSchedule);

/** Get doctor schedule */
router.get(
  "/doctor/:id",
  auth.isAuthenticatedUser,
  schedule.ViewSpecificSchedule,
);

/** Doctor view schedule */
router.get(
  "/doctor/my/schedule",
  auth.isAuthenticatedUser,
  schedule.DoctorViewSchedule,
);

/** Delete doctor schedule */
router.delete(
  "/delete/:id",
  auth.isAuthenticatedUser,
  schedule.DeleteDoctorSchedule,
);

/** Update doctor schedule */
router.put(
  "/update/:id",
  auth.isAuthenticatedUser,
  schedule.UpdateDoctorSchedule,
);

module.exports = router;
