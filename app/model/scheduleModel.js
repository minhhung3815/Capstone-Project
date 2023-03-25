const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  doctor_id: {
    type: mongoose.Schema.ObjectId,
    ref: "Users",
    required: true,
    unique: true,
  },
  doctor_name: {
    type: String,
    required: true,
  },
  working_time: {
    type: Object,
    required: true,
  },
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
