const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
  },
  expiry: {
    type: Date,
    required: true,
  },
  manufacturer: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Medicine", medicineSchema);
