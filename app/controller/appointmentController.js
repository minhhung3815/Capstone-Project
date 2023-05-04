const Appointment = require("../model/appointmentModel");
const Schedule = require("../model/scheduleModel");
const schedule = require("node-schedule");
const { findFreeSlots } = require("../utils/freeSlots");
const {
  Mail,
  VerificationMail,
  AppointmentMail,
} = require("../utils/sendEmail");
const crypto = require("crypto");

/** Admin views all appointments */
exports.ViewAllAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.find()
      .populate({
        path: "doctor_id",
        select: "name",
      })
      .populate({
        path: "user_id",
        select: "name",
      })
      .populate({
        path: "payment_id",
        select: "name",
      })
      .exec();
    return res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};

/** View data of specific appointment */
exports.ViewSpecificAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req?.params?.id)
      .populate({
        path: "doctor_id",
        select: "-password",
      })
      .populate({
        path: "user_id",
        select: "-password",
      })
      .exec();
    if (!appointment) {
      return res
        .status(400)
        .json({ success: false, data: "Appointment not found" });
    }
    return res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, data: error });
  }
};

/** User views all their appointments */
exports.UserViewAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ user_id: req.user?.id });
    return res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};

/** Doctor views all their appointments */
exports.DoctorViewAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({
      doctor_id: req.user?.id,
    });
    return res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};

/** User make a new appointment */
exports.MakeAppointment = async (req, res, next) => {
  const {
    patient_name,
    doctor_id,
    doctor_name,
    appointment_date,
    startTime,
    endTime,
    description,
    service,
  } = req.body;
  const user_id = req.user.id;
  if (
    !patient_name ||
    !startTime ||
    !endTime ||
    !doctor_id ||
    !doctor_name ||
    !appointment_date ||
    !description ||
    !service
  ) {
    return res
      .status(400)
      .json({ success: false, data: "Please provide information" });
  }
  try {
    const appointmentId =
      "APT-" + crypto.randomBytes(3).toString("hex").toUpperCase();
    const new_appointment = await Appointment.create({
      appointmentId,
      user_id,
      patient_name,
      doctor_id,
      doctor_name,
      appointment_date,
      startTime,
      endTime,
      service,
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
        try {
          const template = process.env.MAIL_APPOINTMENT;
          const remind_mail = new AppointmentMail(
            req.user?.email,
            template,
            req.body,
          );
          await remind_mail.sendEmail();
        } catch (error) {
          return res.status(500).json({ success: false, data: error });
        }
      },
    );
    if (notificationJob) {
      new_appointment.notificationJob = remind_name;
    }
    await new_appointment.save();
    return res.status(200).json({ success: true, data: new_appointment._id });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ success: false, data: error });
  }
};

/** Admin make a new appointment */
exports.MakeAdminAppointment = async (req, res, next) => {
  // console.log(req.body);
  const {
    user_id,
    patient_name,
    doctor_id,
    doctor_name,
    appointment_date,
    startTime,
    endTime,
    description,
    service,
  } = req.body;
  if (
    !user_id ||
    !patient_name ||
    !doctor_id ||
    !doctor_name ||
    !appointment_date ||
    !startTime ||
    !endTime ||
    !description ||
    !service
  ) {
    console.log(
      user_id,
      patient_name,
      doctor_id,
      doctor_name,
      appointment_date,
      startTime,
      endTime,
      description,
      service,
    );
    return res
      .status(400)
      .json({ success: false, data: "Please provide information" });
  }
  try {
    // const appointmentCount = await Appointment.countDocuments();
    const appointmentId =
      "APT-" + crypto.randomBytes(3).toString("hex").toUpperCase();
    const new_appointment = await Appointment.create({
      appointmentId,
      user_id,
      patient_name,
      doctor_id,
      doctor_name,
      appointment_date,
      startTime,
      endTime,
      description,
      service,
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
        try {
          const template = process.env.MAIL_APPOINTMENT;
          const remind_mail = new AppointmentMail(
            req.user.email,
            template,
            req.body,
          );
          await remind_mail.sendEmail();
        } catch (error) {
          return res.status(500).json({ success: false, data: error });
        }
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

/** Admin delete appointment */
exports.DeleteAppointment = async (req, res, next) => {
  try {
    const appointment_id = req.params.id;
    const appointment = await Appointment.findByIdAndDelete(appointment_id);
    if (!appointment) {
      return res
        .status(400)
        .json({ success: false, data: "Appointment not found" });
    }
    const appointmentJob = schedule.scheduledJobs[appointment.notificationJob];
    if (appointmentJob) {
      appointmentJob.cancel();
    }
    return res
      .status(200)
      .json({ success: true, data: "Cancel appointment successfully" });
  } catch (error) {
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
        .status(400)
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
    const user_id = req.user?.id;
    const {
      patient_name,
      doctor_id,
      doctor_name,
      appointment_date,
      startTime,
      endTime,
      description,
      service,
    } = req.body;
    if (
      !patient_name ||
      !doctor_id ||
      !doctor_name ||
      !appointment_date ||
      !startTime ||
      !endTime ||
      !description ||
      !service
    ) {
      return res
        .status(400)
        .json({ success: false, data: "Please provide information" });
    }
    const appointment = await Appointment.findByIdAndUpdate(
      appointment_id,
      {
        $set: {
          patient_name: patient_name,
          doctor_id: doctor_id,
          doctor_name: doctor_name,
          user_id: user_id,
          appointment_date: appointment_date,
          description: description,
          service: service,
          startTime,
          endTime,
        },
      },
      { new: true },
    );
    if (!appointment) {
      return res
        .status(400)
        .json({ success: false, data: "Appointment not found" });
    }
    const appointmentJob = schedule.scheduledJobs[appointment.notificationJob];
    if (appointmentJob) {
      appointmentJob.cancel();
    }
    const appointmentDate = new Date(appointment_date.date);
    const notificationTime = new Date(
      appointmentDate.getTime() - 2 * 24 * 3600 * 1000,
    );
    const remind_name =
      user_id + appointment_date.date + appointment_date.startTime;
    schedule.scheduleJob(remind_name, notificationTime, async () => {
      const template = process.env.MAIL_APPOINTMENT;
      const remind_mail = new AppointmentMail(
        req.user?.email,
        template,
        req.body,
      );
      await remind_mail.sendEmail();
    });
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
  const { id } = req.params;
  const {
    user_id = "",
    patient_name = "",
    doctor_id = "",
    doctor_name = "",
    appointment_date = "",
    startTime,
    endTime,
    description = "",
    status = "",
    service = "",
  } = req.body;
  if (
    !status ||
    !id ||
    !user_id ||
    !patient_name ||
    !doctor_id ||
    !doctor_name ||
    !appointment_date ||
    !description ||
    !service ||
    !startTime ||
    !endTime
  ) {
    return res
      .status(400)
      .json({ success: false, data: "Something went wrong" });
  }
  try {
    const appointment = await Appointment.findByIdAndUpdate(id, {
      user_id,
      patient_name,
      doctor_id,
      doctor_name,
      appointment_date,
      description,
      status,
      service,
      startTime,
      endTime,
    });
    if (!appointment) {
      return res
        .status(400)
        .json({ success: false, data: "Appointment not found" });
    }
    return res
      .status(200)
      .json({ success: true, data: "Update appointment status successfully" });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ success: false, data: error });
  }
};

exports.GetAppointmentSlot = async (req, res, next) => {
  const { id, date } = req?.params;
  if (!id || !date) {
    console.log(id, date);
    return res.status(400).json({ success: false, data: "Bad requests" });
  }
  try {
    const daysOfWeek = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const current = new Date();
    const aptDate = new Date(date);
    const dayOfWeek = daysOfWeek[aptDate.getDay()];
    if (current > aptDate) {
      return res
        .status(400)
        .json({ success: false, data: "Select appointment date in the past" });
    }
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    const appointments = await Appointment.find({
      doctor_id: id,
      appointment_date: { $lt: endOfDay, $gt: startOfDay },
    });

    const schedule = await Schedule.findOne(
      {
        doctor_id: id,
      },
      { working_time: { $elemMatch: { date: dayOfWeek } } },
    );

    const freeSlots = await findFreeSlots(schedule, appointments);

    return res.status(200).json({ success: true, data: freeSlots });
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};
