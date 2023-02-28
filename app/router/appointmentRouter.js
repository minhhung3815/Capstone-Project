const express = require('express');
const router = express.Router();
const appointment = require('../controller/appointmentController');

router.get('/all', appointment.ViewAllAppointment);

router.route('/new').post(appointment.MakeAppointment);

module.exports = router;
