const Medicine = require("../model/medicineModel");
const cloudinary = require("cloudinary");

/** Add new medicine to the storage */
exports.AddNewMedicine = async (req, res, next) => {
  const imageUpload = req.file ? req.file : "";
  const { name, description, price, quantity, expiry, manufacturer } = req.body;

  if (!name || !price || !quantity || !expiry || !manufacturer) {
    return res
      .status(400)
      .json({ success: false, data: "Please provide enough information" });
  }

  try {
    const image = imageUpload
      ? await cloudinary.v2.uploader.upload(imageUpload.path, {
          folder: "medicine",
          width: 150,
          crop: "scale",
        })
      : { public_id: "", secure_url: "" };

    await Medicine.create({
      name,
      description,
      price,
      quantity,
      expiry,
      manufacturer,
      image: {
        public_id: image.public_id,
        url: image.secure_url,
      },
    });
    return res
      .status(400)
      .json({ success: true, data: "Add new medicine successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, data: error });
  }
};

/** Edit medicine information*/
exports.EditMedicine = async (req, res, next) => {
  const { id } = req.params;
  const { name, description, price, quantity, expiry, manufacturer } = req.body;
  const imageUpload = req.file ? req.file : "";
  let image = { public_id: "", url: "" };
  try {
    if (imageUpload) {
      const medicine = await Medicine.findById(req.body._id);
      const imageId = medicine.image.public_id;
      await cloudinary.v2.uploader.destroy(imageId);
      const myCloud = await cloudinary.v2.uploader.upload(imageUpload.path, {
        folder: "medicine",
        width: 150,
        crop: "scale",
      });
      image = { public_id: myCloud.public_id, url: myCloud.secure_url };
    }

    await Medicine.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        quantity,
        expiry,
        manufacturer,
        image,
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
    console.log(error);
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
        .status(404)
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
    const medicines = await Medicine.find(
      {},
      "-description -image -manufacturer",
    );
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
