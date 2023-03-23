const express = require("express");
const router = express.Router();
const medicine = require("../controller/medicineController");
const multer = require("../utils/multer");
const auth = require("../middleware/auth");

router.post(
  "/new",
  auth.isAuthenticatedUser,
  multer.single("image"),
  medicine.AddNewMedicine,
);

router.get("/all", auth.isAuthenticatedUser, medicine.GetAllMedicine);

router.get("/detail", auth.isAuthenticatedUser, medicine.GetMedicineDetails);

router.put(
  "/edit",
  auth.isAuthenticatedUser,
  multer.single("image"),
  medicine.EditMedicine,
);

module.exports = router;
