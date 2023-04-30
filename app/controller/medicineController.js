const Medicine = require("../model/medicineModel");
const cloudinary = require("cloudinary");

/** Add new medicine to the storage */
exports.AddNewMedicine = async (req, res, next) => {
  const { name, description, price, quantity, expiry, manufacturer } = req.body;

  if (!name || !price || !expiry || !manufacturer || !description) {
    return res
      .status(400)
      .json({ success: false, data: "Please provide enough informationP" });
  }

  try {
    await Medicine.create({
      name,
      description,
      price,
      quantity,
      expiry,
      manufacturer,
    });
    return res
      .status(200)
      .json({ success: true, data: "Add new medicine successfully" });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ success: false, data: error });
  }
};

/** Edit medicine information*/
exports.EditMedicine = async (req, res, next) => {
  const { id } = req.params;
  const { name, description, price, quantity, expiry, manufacturer } = req.body;
  try {
    await Medicine.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        quantity,
        expiry,
        manufacturer,
      },
      {
        new: true,
        runValidators: true,
      },
    );
    return res.status(200).json({
      success: true,
      data: "Update medicine information successfully",
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ success: false, data: error });
  }
};

/** Delete medicine */
exports.DeleteMedicine = async (req, res, next) => {
  const { id } = req.params;
  try {
    const medicine = await Medicine.findByIdAndRemove(id);
    if (!medicine) {
      return res
        .status(400)
        .json({ success: false, data: "Medicine not found" });
    }

    return res
      .status(200)
      .json({ success: true, data: "Delete medicine successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};

/** Get list of medicine */
exports.GetAllMedicine = async (req, res, next) => {
  try {
    const medicines = await Medicine.find();
    return res.status(200).json({ success: true, data: medicines });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};

/** Get medicine detailed information */
exports.GetMedicineDetails = async (req, res, next) => {
  const id = req.params.id ? req.params.id : "";
  if (!id) {
    return res.status(400).json({ success: false, data: "Invalid request" });
  }
  try {
    const medicines = await Medicine.findById(id);
    return res.status(200).json({ success: true, data: medicines });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};
