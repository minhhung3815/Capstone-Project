const express = require("express");
const router = express.Router();
const statistics = require("../controller/statisticsController");

router.get("/total", statistics.GetTotalUserAndApt);

router.get("/appointments", statistics.GetAppointmentByMonths);

module.exports = router;
