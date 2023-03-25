const express = require("express");
const router = express.Router();
const request = require("../controller/requestController");
const auth = require("../middleware/auth");

/** Get all requests */
router.get("/all", auth.isAuthenticatedUser, request.GetRequests);

/** Create new request */
router.post("/new", auth.isAuthenticatedUser, request.CreateRequest);

/** Edit request */
router.put("/edit/:id", auth.isAuthenticatedUser, request.EditRequest);

/** Delete request */
router.delete("/delete/:id", auth.isAuthenticatedUser, request.DeleteRequests);

/** Get all user's requests */
router.get("/user/requests", auth.isAuthenticatedUser, request.GetUserRequests);

/** Get specific request */
router.get(
  "/specific/requests",
  auth.isAuthenticatedUser,
  request.GetSpecificRequest,
);

module.exports = router;
