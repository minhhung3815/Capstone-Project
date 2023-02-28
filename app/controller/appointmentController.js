const Appointment = require('../model/appointmentModel');

exports.ViewAllAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.find();
    return res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    return res.status(500).json({ success: false, data: 'Error occured' });
  }
};

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
      .json({ success: false, data: 'Please provide information' });
  }
  try {
    await Appointment.create({
      user_id,
      user_name,
      doctor_id,
      doctor_name,
      appointment_date,
      description,
    });
    return res
      .status(200)
      .json({ success: true, data: 'Create a new appointment successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, data: 'Error occured' });
  }
};

exports.UpdateAppointment = async (req, res, next) => {
  
}
