const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
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
    enum: ["pending", "accepted", "unaccepted"],
    default: "pending",
  },
});

module.exports = mongoose.model('Requests', requestSchema);
