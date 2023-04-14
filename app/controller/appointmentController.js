const Appointment = require("../model/appointmentModel");
const User = require("../model/userModel");
const schedule = require("node-schedule");
const {
  Mail,
  VerificationMail,
  AppointmentMail,
} = require("../utils/sendEmail");

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
    const appointment = await Appointment.findById(req.params.id);
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
    const appointments = await Appointment.find({ user_id: req.params.id });
    return res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};

/** Doctor views all their appointments */
exports.DoctorViewAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({
      doctor_id: req.params.id,
    });
    return res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};

/** User make a new appointment */
exports.MakeAppointment = async (req, res, next) => {
  const { user_name, doctor_id, doctor_name, appointment_date, description } =
    req.body;
  const user_id = req.user.id;
  if (
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
    const appointmentDate = new Date(appointment_date.date);
    const notificationTime = new Date(
      appointmentDate.getTime() - 2 * 24 * 3600 * 1000,
    );
    const remind_name =
      user_id + appointment_date.date + appointment_date.startTime;
    const notificationJob = schedule.scheduleJob(
      remind_name,
      notificationTime,
      async () => {
        const template = process.env.MAIL_APPOINTMENT;
        const remind_mail = new AppointmentMail(
          req.user.email,
          template,
          req.body,
        );
        await remind_mail.sendEmail();
      },
    );
    if (notificationJob) {
      new_appointment.notificationJob = remind_name;
    }
    await new_appointment.save();
    return res.status(200).json({ success: true, data: new_appointment._id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, data: error });
  }
};

/** User cancel appointment */
exports.CancelAppointment = async (req, res, next) => {
  try {
    const appointment_id = req.params.id;
    const appointment = await Appointment.findByIdAndUpdate(
      appointment_id,
      { $set: { status: "cancelled" } },
      { new: true },
    );
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, data: "Appointment not found" });
    }
    const appointmentJob = schedule.scheduledJobs[appointment.notificationJob];
    if (appointmentJob) {
      console.log("cc");
      appointmentJob.cancel();
    }
    return res
      .status(200)
      .json({ success: true, data: "Cancel appointment successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};

/** User update appointment */
exports.UpdateNewAppointment = async (req, res, next) => {
  try {
    const appointment_id = req.params.id;
    const user_id = req.user.id;
    const { user_name, doctor_id, doctor_name, appointment_date, description } =
      req.body;
    if (
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
    const appointment = await Appointment.findByIdAndUpdate(
      appointment_id,
      {
        $set: {
          user_name: user_name,
          doctor_id: doctor_id,
          doctor_name: doctor_name,
          user_id: user_id,
          appointment_date: appointment_date,
          description: description,
        },
      },
      { new: true },
    );
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, data: "Appointment not found" });
    }
    const appointmentJob = schedule.scheduledJobs[appointment.notificationJob];
    if (appointmentJob) {
      console.log("ccc");
      appointmentJob.cancel();
    }
    const appointmentDate = new Date(appointment_date.date);
    const notificationTime = new Date(
      appointmentDate.getTime() - 2 * 24 * 3600 * 1000,
    );
    const remind_name =
      user_id + appointment_date.date + appointment_date.startTime;
    const notificationJob = schedule.scheduleJob(
      remind_name,
      notificationTime,
      async () => {
        const template = process.env.MAIL_APPOINTMENT;
        const remind_mail = new AppointmentMail(
          req.user.email,
          template,
          req.body,
        );
        await remind_mail.sendEmail();
      },
    );
    appointment.notificationJob = remind_name;
    await appointment.save();
    return res
      .status(200)
      .json({ success: true, data: "Update appointment successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};

/** Admin updates appointment status */
exports.UpdateAppointment = async (req, res, next) => {
  const { appointment_id } = req.params;
  const { status } = req.body;
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
