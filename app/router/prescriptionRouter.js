const express = require("express");
const router = express.Router();
const prescription = require("../controller/prescriptionController");
const auth = require("../middleware/auth");

/** Get all prescription */
router.get(
  "/list/all",
  auth.isAuthenticatedUser,
  prescription.GetAllDescription,
);

/** Get all prescription based on user id */
router.get(
  "/list/user/:id",
  auth.isAuthenticatedUser,
  prescription.GetAllUserPrescription,
);

/** Get all prescription based on doctor id */
router.get(
  "/list/doctor/:id",
  auth.isAuthenticatedUser,
  prescription.GetAllDoctorPrescription,
);

/** Get detailed prescription */
router.get(
  "/list/detail/:id",
  auth.isAuthenticatedUser,
  prescription.GetDetailPrescription,
);

/** Create prescription */
router.post("/new", auth.isAuthenticatedUser, prescription.CreatePrescription);

module.exports = router;