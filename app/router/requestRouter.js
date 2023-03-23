const express = require("express");
const router = express.Router();
const request = require("../controller/requestController");
const auth = require("../middleware/auth");

router
  .route("/")
  .get(auth.isAuthenticatedUser, request.GetRequests)
  .post(auth.isAuthenticatedUser, request.CreateRequest)
  .delete(auth.isAuthenticatedUser, request.DeleteRequests);

module.exports = router;
