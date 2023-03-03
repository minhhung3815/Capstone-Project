const express = require('express');
const router = express.Router();
const specialization = require('../controller/specializationController');

router
  .route('/')
  .get(specialization.GetSpecialization)
  .post(specialization.CreateNewSpecialization)
  .delete(specialization.DeleteSpecialization);

module.exports = router;
