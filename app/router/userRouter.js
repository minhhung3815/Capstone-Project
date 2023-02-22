const express = require('express');
const router = express.Router();
const appointment = require('../controller/appointmentController');

router.route('/appointment').post(appointment.MakeAppointment);

module.exports = router;
