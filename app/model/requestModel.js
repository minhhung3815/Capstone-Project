const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: "Doctors",
    required: true,
  },
  receiver_id: {
    type: mongoose.Schema.ObjectId,
    ref: "Users",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  explanation: {
    type: String,
    required: true,
  },
  accepted: {
    type: String,
    enum: ["pending", "accept", "reject"],
    default: "pending",
  },
});

module.exports = mongoose.model("Requests", requestSchema);
