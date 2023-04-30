const User = require("../model/userModel");
const Doctor = require("../model/doctorModel");

exports.checkExistedEmail = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  const doctor = await Doctor.findOne({ email });
  if (user || doctor) {
    return res
      .status(400)
      .json({ success: false, data: "Email is already existed" });
  }

  return next();
};
