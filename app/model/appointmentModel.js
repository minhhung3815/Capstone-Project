const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
  },
  user_id: {
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
      type: Array,
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
  payment: {
    id: {
      type: String,
      required: false,
      default: '1', //temporary field
    },
    status: {
      type: String,
      required: false,
      default: '1', //temporary field
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
