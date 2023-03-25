const express = require("express");
const router = express.Router();
const specialization = require("../controller/specializationController");
const auth = require("../middleware/auth");

/** Get all doctor's specializations */
router.get(
  "/all",
  auth.isAuthenticatedUser,
  specialization.GetAllSpecialization,
);

/** Get a specific doctor specialization */
router.get(
  "/detail/:id",
  auth.isAuthenticatedUser,
  specialization.GetSpecialization,
);

/** Create new specialization */
router.post(
  "/new",
  auth.isAuthenticatedUser,
  specialization.CreateNewSpecialization,
);

/** Delete specialization */
router.delete(
  "/delete/:id",
  auth.isAuthenticatedUser,
  specialization.DeleteSpecialization,
);

module.exports = router;
