const mongoose = require('mongoose');

const specializationSchema = new mongoose.Schema({
  doctor_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
    required: true,
  },
  doctor_name: {
    type: String,
  },
  description: {
    type: String,
  },
  specilization: {
    type: String,
  },
  exp: {
    type: Number,
  },
});

module.exports = mongoose.model('Specializations', specializationSchema);
