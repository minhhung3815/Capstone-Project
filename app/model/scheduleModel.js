const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  doctor_id: {
    type: mongoose.Schema.ObjectId,
    ref: "Doctors",
    required: true,
    unique: true,
  },
  working_time: [
    {
      date: { type: String, required: true },
      time: { type: Array },
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Schedule", scheduleSchema);
