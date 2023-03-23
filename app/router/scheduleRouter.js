const express = require("express");
const router = express.Router();
const schedule = require("../controller/scheduleController");
const auth = require("../middleware/auth");

router
  .route("/")
  .get(auth.isAuthenticatedUser, schedule.ViewAllDoctorSchedule)
  .post(auth.isAuthenticatedUser, schedule.CreateDoctorSchedule);

module.exports = router;
