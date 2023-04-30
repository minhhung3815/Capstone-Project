const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
  },
  gender: {
    type: String,
    required: true,
  },
  phone_number: {
    type: Number,
    required: true,
  },
  avatar: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  password: {
    type: String,
    required: true,
  },
  date_of_birth: {
    type: Date,
    required: true,
  },
  role: {
    type: String,
    ref: "Role",
    default: "doctor",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogined: {
    type: Date,
  },
  description: {
    type: String,
    required: true,
  },
  specialization: [
    {
      type: String,
      required: true,
    },
  ],
  exp: [
    {
      type: String,
      required: true,
    },
  ],
  achievements: [
    {
      type: String,
      required: true,
    },
  ],
  refreshToken: String,
});

doctorSchema.methods.getJWTToken = function () {
  return jwt.sign(
    { id: this._id, name: this.name, role: this.role, email: this.email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
    },
  );
};

doctorSchema.methods.getRefreshToken = function () {
  return jwt.sign(
    { id: this._id, name: this.name, role: this.role, email: this.email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
    },
  );
};

doctorSchema.methods.comparePassword = async (
  enteredPassword,
  hashedPassword,
) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

module.exports = mongoose.model("Doctors", doctorSchema);
