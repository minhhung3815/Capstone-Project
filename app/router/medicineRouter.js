const express = require("express");
const router = express.Router();
const medicine = require("../controller/medicineController");
const multer = require("../utils/multer");
const auth = require("../middleware/auth");

/** Create new medicine */
router.post(
  "/new",
  auth.isAuthenticatedUser,
  multer.single("image"),
  medicine.AddNewMedicine,
);

/** Get list of all medicines */
router.get("/all", auth.isAuthenticatedUser, medicine.GetAllMedicine);

/** Get medicine detail info */
router.get(
  "/detail/:id",
  auth.isAuthenticatedUser,
  medicine.GetMedicineDetails,
);

/** Update medicine information */
router.put(
  "/edit/:id",
  auth.isAuthenticatedUser,
  multer.single("image"),
  medicine.EditMedicine,
);

/** Delete  medicine */
router.delete(
  "/delete/:id",
  auth.isAuthenticatedUser,
  multer.single("image"),
  medicine.DeleteMedicine,
);

module.exports = router;
