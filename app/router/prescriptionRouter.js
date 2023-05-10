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
  "/list/user",
  auth.isAuthenticatedUser,
  prescription.GetAllUserPrescription,
);

/** Get all prescription based on doctor id */
router.get(
  "/list/doctor",
  auth.isAuthenticatedUser,
  prescription.GetAllDoctorPrescription,
);

/** Get detailed prescription */
router.get(
  "/list/detail/:id",
  auth.isAuthenticatedUser,
  prescription.GetDetailPrescription,
);

router.delete(
  "/delete/:id",
  auth.isAuthenticatedUser,
  prescription.DeletePrescription,
);

/** Create prescription */
router.post("/new", auth.isAuthenticatedUser, prescription.CreatePrescription);

/** Update prescription */
router.post(
  "/update/:id",
  auth.isAuthenticatedUser,
  prescription.UpdatePrescription,
);

router.get("/download/:id", prescription.SendPrescription);

module.exports = router;
