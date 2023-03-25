const Prescription = require("../model/prescriptionModel");

/** Get all prescription */
exports.GetAllDescription = async (req, res, next) => {
  try {
    const list = await Prescription.find();
    return res.status(200).json({ success: true, data: list });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: error,
    });
  }
};

/** Get all prescription based on user id */
exports.GetAllUserPrescription = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, data: "Invalid user id" });
  }
  try {
    const list = await Prescription.find({ user_id: id });
    return res.status(200).json({ success: true, data: list });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: error,
    });
  }
};

/** Get all prescription based on doctor id */
exports.GetAllDoctorPrescription = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, data: "Invalid doctor id" });
  }
  try {
    const list = await Prescription.find({ doctor_id: id });
    return res.status(200).json({ success: true, data: list });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: error,
    });
  }
};

/** Get detail prescription */
exports.GetDetailPrescription = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, data: "Invalid user id" });
  }
  try {
    const list = await Prescription.findById({ _id: id })
      .populate({
        path: "user_id",
        select: "email avatar",
      })
      .populate({
        path: "doctor_id",
        select: "email avatar",
      })
      .exec();
    return res.status(200).json({ success: true, data: list });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: error,
    });
  }
};

/** Create prescription */
exports.CreatePrescription = async (req, res, next) => {
  const {
    user_id = "",
    doctor_id,
    patient_name,
    doctor_name,
    medications,
    frequency,
    notes = "",
  } = req.body ? req.body : "";

  if (
    !doctor_id ||
    !patient_name ||
    !doctor_name ||
    !medications ||
    !frequency
  ) {
    return res
      .status(400)
      .json({ success: false, data: "Please fill all forms" });
  }
  try {
    const prescription = user_id
      ? new Prescription({
          user_id,
          doctor_id,
          patient_name,
          doctor_name,
          medications,
          frequency,
          notes,
        })
      : new Prescription({
          doctor_id,
          patient_name,
          doctor_name,
          medications,
          frequency,
          notes,
        });

    await prescription.save();

    return res
      .status(200)
      .json({ success: true, data: "Create new prescription successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: error,
    });
  }
};

/** Send prescription */
exports.SendPrescription = async (req, res, next) => {
  const options = {
    template: process.env.MAIL_PRESCRIPTION,
    subject: "Patient Prescription",
  };
};
