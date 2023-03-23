const express = require("express");
const router = express.Router();
const specialization = require("../controller/specializationController");
const auth = require("../middleware/auth");

router.get(
  "/detail",
  auth.isAuthenticatedUser,
  specialization.GetSpecialization,
);

router.post(
  "/new",
  auth.isAuthenticatedUser,
  specialization.CreateNewSpecialization,
);

router.delete(
  "/delete",
  auth.isAuthenticatedUser,
  specialization.DeleteSpecialization,
);

module.exports = router;
