const express = require('express');
const router = express.Router();
const request = require('../controller/requestController');

router
  .route('/')
  .get(request.GetRequests)
  .post(request.CreateRequest)
  .delete(request.DeleteRequests);

module.exports = router;
