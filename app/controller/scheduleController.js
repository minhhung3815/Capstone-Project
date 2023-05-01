const { request } = require("express");
const Schedule = require("../model/scheduleModel");
/**
 * Create doctor working schedule
 */
exports.CreateDoctorSchedule = async (req, res, next) => {
  const { working_time, doctor_id } = req.body;
  if (!working_time || !doctor_id) {
    return res
      .status(400)
      .json({ success: false, data: "Something went wrong" });
  }
  try {
    await Schedule.create({
      doctor_id,
      working_time,
    });
    return res
      .status(200)
      .json({ success: true, data: "Create schedule successfully" });
  } catch (error) {
    // console.log(error);
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ success: false, data: "Schedule is already existed" });
    }
    return res.status(500).json({ success: false, data: error });
  }
};

/** View all doctor schedule */
exports.ViewAllSchedule = async (req, res, next) => {
  try {
    const allSchedule = await Schedule.find().populate({
      path: "doctor_id",
      select: "_id name",
    });
    return res.status(200).json({
      success: true,
      data: allSchedule,
    });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};

/** View specific doctor shedule */
exports.ViewSpecificSchedule = async (req, res, next) => {
  const { id } = req.params;
  try {
    const schedule = await Schedule.findById(id).populate({
      path: "doctor_id",
      select: "-password",
    });
    if (!schedule) {
      return res
        .status(400)
        .json({ success: false, data: "Schedule not found" });
    }
    return res.status(200).json({ success: true, data: schedule });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};

/** Doctor view shedule */
exports.DoctorViewSchedule = async (req, res, next) => {
  const id = req.user?.id;
  try {
    const schedule = await Schedule.findOne({ doctor_id: id }).populate({
      path: "doctor_id",
      select: "-password",
    });
    if (!schedule) {
      return res
        .status(400)
        .json({ success: false, data: "Schedule not found" });
    }
    return res.status(200).json({ success: true, data: schedule });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};

/** Delete doctor schedule */
exports.DeleteDoctorSchedule = async (req, res, next) => {
  const { id } = req.params;
  try {
    const schedule = await Schedule.findByIdAndDelete(id);
    if (!schedule) {
      return res
        .status(400)
        .json({ success: false, data: "Schedule not found" });
    }
    return res
      .status(200)
      .json({ success: true, data: "Delete schedule successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};

/** Update doctor schedule */
exports.UpdateDoctorSchedule = async (req, res, next) => {
  const { id } = req.params;
  const { working_time } = req.body;
  try {
    const schedule = await Schedule.findByIdAndUpdate(
      id,
      {
        working_time: working_time,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true },
    );
    if (!schedule) {
      return res
        .status(400)
        .json({ success: false, data: "Schedule not found" });
    }
    return res
      .status(200)
      .json({ success: true, data: "Update schedule successfully" });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ success: false, data: error });
  }
};
