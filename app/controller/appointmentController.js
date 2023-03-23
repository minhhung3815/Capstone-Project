const Appointment = require("../model/appointmentModel");
const User = require("../model/userModel");

/** Admin views all appointments */
exports.ViewAllAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.find();
    return res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};

/** View data of specific appointment */
exports.ViewSpecificAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById({ _id: req.params.id });
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, data: "Appointment not found" });
    }
    return res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};

/** User views all their appointments */
exports.UserViewAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.findById({ user_id: req.params.id });
    return res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};

/** Doctor views all their appointments */
exports.DoctorViewAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.findById({
      doctor_id: req.params.id,
    });
    return res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};

/** User make a new appointment */
exports.MakeAppointment = async (req, res, next) => {
  const {
    user_name,
    user_id,
    doctor_id,
    doctor_name,
    appointment_date,
    description,
  } = req.body;
  if (
    !user_id ||
    !user_name ||
    !doctor_id ||
    !doctor_name ||
    !appointment_date ||
    !description
  ) {
    return res
      .status(400)
      .json({ success: false, data: "Please provide information" });
  }
  try {
    const new_appointment = await Appointment.create({
      user_id,
      user_name,
      doctor_id,
      doctor_name,
      appointment_date,
      description,
    });
    return res.status(200).json({ success: true, data: new_appointment._id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, data: error });
  }
};

/** Admin updates appointment status */
exports.UpdateAppointment = async (req, res, next) => {
  const { status, appointment_id } = req.body;
  if (!status || !appointment_id) {
    return res
      .status(400)
      .json({ success: false, data: "Something went wrong" });
  }
  try {
    const appointment = await Appointment.findByIdAndUpdate(appointment_id, {
      status: status,
    });
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, data: "Appointment not found" });
    }
    return res
      .status(200)
      .json({ success: true, data: "Update appointment status successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, data: error });
  }
};
