const express = require("express");
const router = express.Router();
const medicine = require("../controller/medicineController");
const multer = require("../utils/multer");

router.post("/new", multer.single("image"), medicine.AddNewMedicine);

router.get("/all", medicine.GetAllMedicine);

router.get("/detail", medicine.GetMedicineDetails);

router.put("/edit", multer.single("image"), medicine.EditMedicine);

module.exports = router;
