const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: String,
      required: true,
      unique: true,
    },
    patient_name: {
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
      ref: "Doctors",
      required: true,
    },
    doctor_name: {
      type: String,
      required: true,
    },
    appointment_date: {
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
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["waiting", "cancelled", "finished", "examined"],
      default: "waiting",
    },
    service: [
      {
        type: { type: String, required: true, default: "Other" },
        price: { type: Number, required: true, default: 0 },
      },
    ],
    prescription_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
      default: null,
    },
    payment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },
    notificationJob: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { strict: false },
);

module.exports = mongoose.model("Appointment", appointmentSchema);
