const express = require('express');
const router = express.Router();
const admin = require('../controller/adminController');
const schedule = require('../controller/scheduleController');

router
  .route('/users')
  .get(admin.GetUser)
  .post(admin.AddNewUser)
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

router.get('/schedule/appointment',)
module.exports = router;
