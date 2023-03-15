const User = require("../model/userModel");
const cloudinary = require("cloudinary");
const sendToken = require("../utils/sendToken");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");

/**
 * Get list of users or a user profile
 */
exports.GetUser = async (req, res, next) => {
  const id = req.query.id ? req.query.id : "";
  const { role } = req.params;
  try {
    if (role !== "manager" || role !== "doctor" || role !== "user") {
      return res.status(200).json({ success: true, data: [] });
    }
    if (!id) {
      const allUser = await User.find({ role: role }, { password: 0 });
      return res.status(200).json({ success: true, data: allUser });
    }
    const allUser = await User.findById(id, {
      password: 0,
    });
    return res.status(200).json({ success: true, data: allUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, data: "Error occurred" });
  }
};

/**
 * Create new user
 */
exports.AddNewUser = async (req, res, next) => {
  const fileUpload = req.file ? req.file : "";
  const name = req.body.name ? req.body.name : "";
  const email = req.body.email ? req.body.email : "";
  const password = req.body.password ? req.body.password : "";
  const gender = req.body.gender ? req.body.gender : "";
  const phone_number = req.body.phone_number ? req.body.phone_number : "";
  const date_of_birth = req.body.date_of_birth
    ? new Date(req.body.date_of_birth)
    : "";
  const role = req.body.role ? req.body.role : "";
  if (
    !name ||
    !email ||
    !gender ||
    !phone_number ||
    !date_of_birth ||
    !password ||
    !role
  ) {
    return res.status(400).json({
      success: false,
      data: "Please provide information",
    });
  }
  try {
    const avatar = fileUpload
      ? await cloudinary.v2.uploader.upload(fileUpload.path, {
          folder: "avatar",
          width: 150,
          crop: "scale",
        })
      : { public_id: "", secure_url: "" };
    await User.create({
      name,
      email,
      gender,
      phone_number,
      password,
      date_of_birth,
      role,
      avatar: {
        public_id: avatar.public_id,
        url: avatar.secure_url,
      },
    });

    return res.status(200).json({
      success: true,
      data: "Create account successfully",
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        data: "Email is already existed",
      });
    }
    return res.status(500).json({
      success: false,
      data: "Something went wrong",
    });
  }
};

/**
 * Delete a user
 */
exports.DeleteUser = async (req, res, next) => {
  const id = req.body.id ? req.body.id : "";
  if (!id) {
    return res
      .status(400)
      .json({ success: false, data: "Please select user to delete" });
  }
  try {
    const user = await User.findOneAndDelete({ _id: id });
    if (!user) {
      return res.status(404).json({ success: false, data: "User not found" });
    }
    return res
      .status(200)
      .json({ success: true, data: "Delete user successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, data: "Something went wrong" });
  }
};

/**
 * Create new account (user)
 */
exports.Register = async (req, res, next) => {
  const fileUpload = req.file ? req.file : "";
  const name = req.body.name ? req.body.name : "";
  const email = req.body.email ? req.body.email : "";
  const password = req.body.password ? req.body.password : "";
  const gender = req.body.gender ? req.body.gender : "";
  const phone_number = req.body.phone_number ? req.body.phone_number : "";
  const date_of_birth = req.body.date_of_birth
    ? new Date(req.body.date_of_birth)
    : "";
  const address = req.body.address ? req.body.address : "";
  const identity_card = req.body.identity_card ? req.body.identity_card : "";
  const role = req.body.role ? req.body.role : "user";
  if (
    !fileUpload ||
    !name ||
    !email ||
    !gender ||
    !phone_number ||
    !date_of_birth ||
    !password
  ) {
    return res.status(400).json({
      success: false,
      data: "Please provide valid fields",
    });
  }
  try {
    const avatar = await cloudinary.v2.uploader.upload(fileUpload.path, {
      folder: "avatar",
      width: 150,
      crop: "scale",
    });
    await User.create({
      name,
      email,
      gender,
      phone_number,
      password,
      identity_card,
      date_of_birth,
      address,
      role,
      avatar: {
        public_id: avatar.public_id,
        url: avatar.secure_url,
      },
    });

    return res.status(200).json({
      success: true,
      data: "Create account successfully",
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        data: "Email is already existed",
      });
    }
    return res.status(500).json({
      success: false,
      data: "Something went wrong",
    });
  }
};

/**
 * Login to the system
 */
exports.Login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      data: "Please provide valid fields",
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, data: "Email is not found" });
    }

    const checkPassword = await user.comparePassword(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        success: false,
        data: "Password is incorrect",
      });
    }
    sendToken(user, 200, res);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, data: "Something went wrong" });
  }
};

/**
 * Send email to verify account
 */
exports.EmailVerification = async (req, res, next) => {
  const email = req.body.email ? req.body.email : "";
  if (!email) {
    return res
      .status(400)
      .json({ success: false, data: "Please provide valid information" });
  }
  try {
    const subject = "Email Verification";
    const token = jwt.sign({ data: "Token Data" }, process.env.JWT_SECRET, {
      expiresIn: process.env.MAIL_VERIFICATION_EXPIRE,
    });
    const verificationUrl = `${req.protocol}://${req.get(
      "host",
    )}/user/verification/${token}`;
    const data =
      "Thanks for starting the new account creation process. \
      We want to make sure it's really you. Please click the button below \
      to verify your email address. If you do not want to create an account, \
      you can ignore this message. ";
    const options = { email, subject, data, verificationUrl };
    await sendEmail(options);
    return res
      .status(200)
      .json({ success: true, data: "Email has already sent to user" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, data: "Error occurred" });
  }
};

/**
 * Get email with token to verify account
 */
exports.EmailVerificationToken = async (req, res, next) => {
  const { token } = req.params;
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ success: true, data: "Email is verified" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, data: "Email verification link is expired" });
  }
};
