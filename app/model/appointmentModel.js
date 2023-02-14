const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient_name: {
    type: String,
    required: true,
  },
  patient_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
    required: true,
  },
  doctor_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
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
    time: {
      type: Date,
      required: true,
    },
  },
  description: {
    type: String,
    required: true,
  },
  finished: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
