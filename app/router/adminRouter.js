const express = require('express');
const router = express.Router();
const admin = require('../controller/adminController');
const schedule = require('../controller/scheduleController');
const appointment = require('../controller/appointmentController');
const multer = require('../utils/multer');
router
  .route('/users')
  .get(admin.GetUser)
  .post(multer.single('avatar'), admin.AddNewUser)
  .delete(admin.DeleteUser);

router
  .route('/requests')
  .get(admin.GetRequests)
  .post(admin.CreateRequest)
  .delete(admin.DeleteRequests);

router
  .route('/schedule')
  .post(schedule.CreateDoctorSchedule)
  .get(schedule.ViewAllDoctorSchedule);

router.get('/appointment/all', appointment.ViewAllAppointment);

module.exports = router;
