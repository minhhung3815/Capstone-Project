const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Role', roleSchema);
