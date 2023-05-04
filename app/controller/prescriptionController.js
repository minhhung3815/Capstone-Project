const Prescription = require("../model/prescriptionModel");
const Appointment = require("../model/appointmentModel");
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
  const id = req.user?.id;
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
  const id = req.user?.id;
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
    diagnose,
    appointment_id = "",
    notes = "",
    price = 0,
  } = req.body;
  if (!patient_name || !doctor_name || !medications || !diagnose) {
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
          diagnose,
          notes,
          price,
        })
      : new Prescription({
          patient_name,
          doctor_name,
          medications,
          diagnose,
          notes,
          price,
        });

    await prescription.save();
    appointment_id &&
      (await Appointment.findByIdAndUpdate(appointment_id, {
        prescription_id: prescription._id,
      }));
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

/** Update prescription */
exports.UpdatePrescription = async (req, res, next) => {
  const { id } = req?.params;
  const {
    user_id = "",
    doctor_id,
    patient_name,
    doctor_name,
    medications,
    diagnose,
    notes = "",
    price = 0,
  } = req.body;
  if (!patient_name || !doctor_name || !medications || !diagnose) {
    return res
      .status(400)
      .json({ success: false, data: "Please fill all forms" });
  }
  try {
    const prescription = user_id
      ? Prescription.findOneAndUpdate(
          { prescription_id: id },
          {
            user_id,
            doctor_id,
            patient_name,
            doctor_name,
            medications,
            diagnose,
            notes,
            price,
          },
        )
      : Prescription.findOneAndUpdate(
          { prescription_id: id },
          {
            patient_name,
            doctor_id,
            doctor_name,
            medications,
            diagnose,
            notes,
            price,
          },
        );
    if (!prescription) {
      return res
        .status(404)
        .json({ success: false, data: "Prescription not found" });
    }
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

/** Get detail prescription */
exports.DeletePrescription = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, data: "Invalid user id" });
  }
  try {
    const list = await Prescription.findByIdAndDelete(id);
    if (!list) {
      return res
        .status(400)
        .json({ success: false, data: "Prescription not found" });
    }
    await Appointment.findOneAndUpdate(
      { precription_id: list._id },
      { precription_id: null },
    );
    return res
      .status(200)
      .json({ success: true, data: "Delete prescription successfully" });
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
