const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
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
    default: "user",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogined: {
    type: Date,
  },

  refreshToken: String,
});

// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     next();
//   }
//   this.password = await bcrypt.hash(this.password, 10);
// });

userSchema.methods.getJWTToken = function () {
  return jwt.sign(
    { id: this._id, name: this.name, role: this.role, email: this.email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
    },
  );
};

userSchema.methods.getRefreshToken = function () {
  return jwt.sign(
    { id: this._id, name: this.name, role: this.role, email: this.email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
    },
  );
};

userSchema.methods.comparePassword = async (
  enteredPassword,
  hashedPassword,
) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

module.exports = mongoose.model("Users", userSchema);
