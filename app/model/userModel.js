const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
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
  password: {
    type: String,
    required: true,
  },
  identity_card: {
    type: String,
    required: false,
  },
  date_of_birth: {
    type: Date,
    required: true,
  },
  address: {
    type: String,
    required: false,
  },
  specialization: {
    type: Object,
    required: false,
  },
  role: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogined: {
    type: Date,
  },
});

userSchema.pre('save', async next => {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async (
  enteredPassword,
  hashedPassword,
) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

module.exports = mongoose.model('Users', userSchema);
