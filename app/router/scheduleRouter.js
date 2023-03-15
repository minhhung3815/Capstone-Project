const express = require("express");
const router = express.Router();
const schedule = require("../controller/scheduleController");

router
  .route("/")
  .get(schedule.ViewAllDoctorSchedule)
  .post(schedule.CreateDoctorSchedule);

module.exports = router;
