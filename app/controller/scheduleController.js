const Schedule = require('../model/scheduleModel');
const User = require('../model/userModel');
/**
 * Create doctor working schedule
 */
exports.CreateDoctorSchedule = async (req, res, next) => {
  const { working_time, doctor_name } = req.body;
  if (!working_time || !doctor_name) {
    return res
      .status(400)
      .json({ success: false, data: 'Something went wrong' });
  }
  try {
    const doctor = await User.find({ name: doctor_name }, {});
    await Schedule.create({
      doctor_id: doctor[0]._id,
      doctor_name,
      working_time,
    });
    return res
      .status(200)
      .json({ success: true, data: 'Create schedule successfully' });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res
        .status(500)
        .json({ success: false, data: 'Schedule is already existed' });
    }
    return res
      .status(500)
      .json({ success: false, data: 'Something went wrong' });
  }
};

exports.ViewAllDoctorSchedule = async (req, res, next) => {
  try {
    const allSchedule = await Schedule.find();
    return res.status(200).json({
      success: true,
      data: allSchedule,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, data: 'Something went wrong' });
  }
};

exports.ViewDoctorAppointment = async (req, res, next) => {
  try {
    const doctor_id = req.query.doctor_id;
  } catch (error) {}
};
