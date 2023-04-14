const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: "Users",
    required: true,
  },
  doctor_id: {
    type: mongoose.Schema.ObjectId,
    ref: "Users",
    required: true,
  },
  doctor_name: {
    type: String,
    required: true,
  },
  appointment_date: {
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["waiting", "cancelled", "finished"],
    default: "waiting",
  },
  payment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
  },
  notificationJob: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
