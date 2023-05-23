const mongoose = require("mongoose");

const PrescriptionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctors",
  },
  patient_name: {
    type: String,
    required: true,
  },
  doctor_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  diagnose: {
    type: String,
    required: true,
  },
  medications: [
    {
      name: {
        type: String,
        required: true,
      },
      dosage: {
        type: String,
        required: true,
      },
      price: {
        type: String,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("Prescription", PrescriptionSchema);
