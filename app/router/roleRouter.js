const express = require("express");
const router = express.Router();
const role = require("../controller/roleController");
const auth = require("../middleware/auth");

/** Create and view all role */
router
  .route("/")
  .get(auth.isAuthenticatedUser, role.ViewAllRole)
  .post(auth.isAuthenticatedUser, role.CreateRole);

module.exports = router;
