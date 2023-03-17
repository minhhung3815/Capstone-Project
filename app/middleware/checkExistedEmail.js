const User = require("../model/userModel");

exports.checkExistedEmail = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    return res
      .status(400)
      .json({ success: false, data: "Email is already existed" });
  }

  return next();
};
