const User = require("../model/userModel");
const InactiveUser = require("../model/inactiveUserModel");
const Specialization = require("../model/specializationModel");
const cloudinary = require("cloudinary");
const sendToken = require("../utils/sendToken");
const sendEmail = require("../utils/sendEmail");
const { hashedPassword } = require("../utils/hashPassword");
const jwt = require("jsonwebtoken");

/******-------------ADMIN--------------- ******/

/** Create new user and admin */
exports.AddNewUserAndAdmin = async (req, res, next) => {
  const fileUpload = req.file ? req.file : "";
  const name = req.body.name ? req.body.name : "";
  const email = req.body.email ? req.body.email : "";
  const password = req.body.password
    ? await hashedPassword(req.body.password)
    : "";
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
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        data: "Email is already existed",
      });
    }
    return res.status(500).json({
      success: false,
      data: error,
    });
  }
};

/** Delete a user */
exports.DeleteUserAndAdmin = async (req, res, next) => {
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
    return res.status(500).json({ success: false, data: error });
  }
};

/** Create new doctor */
exports.AddNewDoctor = async (req, res, next) => {
  const fileUpload = req.file ? req.file : "";
  const name = req.body.name ? req.body.name : "";
  const email = req.body.email ? req.body.email : "";
  const password = req.body.password
    ? await hashedPassword(req.body.password)
    : "";
  const gender = req.body.gender ? req.body.gender : "";
  const phone_number = req.body.phone_number ? req.body.phone_number : "";
  const date_of_birth = req.body.date_of_birth
    ? new Date(req.body.date_of_birth)
    : "";
  const role = req.body.role ? req.body.role : "";
  const description = req.body.description ? req.body.description : "";
  const specialization = req.body.specialization ? req.body.specialization : "";
  const exp = req.body.exp ? req.body.exp : "";
  if (
    !name ||
    !email ||
    !gender ||
    !phone_number ||
    !date_of_birth ||
    !password ||
    !role ||
    !specialization ||
    !exp ||
    !description
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
    const new_user = await User.create({
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

    await Specialization.create({
      doctor_id: new_user._id,
      doctor_name: name,
      description,
      specialization,
      exp,
    });

    return res.status(200).json({
      success: true,
      data: "Create account successfully",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        data: "Email is already existed",
      });
    }
    return res.status(500).json({
      success: false,
      data: error,
    });
  }
};

/** Delete a doctor */
exports.DeleteDoctor = async (req, res, next) => {
  const id = req.params.id ? req.params.id : "";
  if (!id) {
    return res
      .status(400)
      .json({ success: false, data: "Please select doctor to delete" });
  }
  try {
    const user = await User.findOneAndDelete({ _id: id });
    const specialization = await Specialization.findOneAndDelete({
      doctor_id: id,
    });
    if (!user || !specialization) {
      return res.status(404).json({ success: false, data: "User not found" });
    }
    return res
      .status(200)
      .json({ success: true, data: "Delete user successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};

/******-------------ALL ROLE--------------- ******/
/** Login to the system*/
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
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, data: error });
  }
};

/** Register account (user)*/
exports.Register = async (req, res, next) => {
  console.log(process.env.MAIL_VERIFICATION);
  const fileUpload = req.file ? req.file : "";
  const name = req.body.name ? req.body.name : "";
  const email = req.body.email ? req.body.email : "";
  const password = req.body.password
    ? await hashedPassword(req.body.password)
    : "";
  const gender = req.body.gender ? req.body.gender : "";
  const phone_number = req.body.phone_number ? req.body.phone_number : "";
  const date_of_birth = req.body.date_of_birth
    ? new Date(req.body.date_of_birth)
    : "";
  const role = "user";
  if (
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
  const template = process.env.MAIL_VERIFICATION;
  const subject = "Email Verification";
  const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
    expiresIn: process.env.MAIL_VERIFICATION_EXPIRE,
  });

  const verificationUrl = `${req.protocol}://${req.get(
    "host",
  )}/user/verification/${token}`;
  const data =
    "Thanks for starting the new account creation process. \
      We want to make sure it's really you. Please click the button below \
      to verify your email address. If you do not want to create an account, \
      you can ignore this message.";
  const options = { email, subject, data, verificationUrl, template };
  try {
    const avatar = fileUpload
      ? await cloudinary.v2.uploader.upload(fileUpload.path, {
          folder: "avatar",
          width: 150,
          crop: "scale",
        })
      : { public_id: "", secure_url: "" };
    await Promise.all([
      sendEmail(options),
      InactiveUser.create({
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
        token,
      }),
    ]);
    return res.status(200).json({
      success: true,
      data: "Email has already been sent to user",
    });
  } catch (error) {
    if (error.code === 11000) {
      console.log(error);
      return res.status(400).json({
        success: false,
        data: "Email is already existed",
      });
    }
    return res.status(500).json({
      success: false,
      data: error,
    });
  }
};

/** Get email with token to verify account*/
exports.EmailVerificationToken = async (req, res, next) => {
  const { token } = req.params;
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    const user = await InactiveUser.findOneAndDelete({ token });
    if (!user) {
      return res.status(400).json({ success: false, data: "Invalid token" });
    }
    const {
      name,
      email,
      password,
      gender,
      phone_number,
      date_of_birth,
      role,
      avatar,
    } = user;
    await User.create({
      name,
      email,
      password,
      gender,
      phone_number,
      date_of_birth,
      role,
      avatar,
    });
    return res.redirect("https://facebook.com");
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        data: "Email is already existed",
      });
    }
    return res
      .status(500)
      .json({ success: false, data: "Email verification link is expired" });
  }
};

/** Get list of users based on role  */
exports.GetUser = async (req, res, next) => {
  const { role } = req.params;
  try {
    if (role !== "doctor" && role !== "manager" && role !== "user") {
      return res.status(400).json({ success: false, data: "Undefined role" });
    }
    const allUser = await User.find({ role: role }, "name email gender avatar");
    return res.status(200).json({ success: true, data: allUser });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};

/** Get user detail information (user and admin)*/
exports.GetUserAndAdminDetails = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, data: "Missing user id" });
  }
  try {
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, data: "User doesn't exist" });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};

/** Get doctor detail information */
exports.GetDoctorDetail = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, data: "Missing user id" });
  }
  try {
    const user = await Specialization.findOne({ doctor_id: id })
      .populate("doctor_id")
      .exec();

    if (!user) {
      return res
        .status(404)
        .json({ success: false, data: "User doesn't exist" });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};

/** Update profile */
exports.UpdateProfile = async (req, res, next) => {
  const fileUpload = req.file ? req.file : "";
  const {
    name = "",
    phone_number = "",
    gender = "",
    date_of_birth = "",
  } = req.body;
  if (!name || !phone_number || !gender || !date_of_birth) {
    return res.status(400).json({ success: false, data: "Bad request" });
  }
  const userData = { name, phone_number, gender, date_of_birth };
  try {
    if (fileUpload) {
      const user = await User.findById(req.user.id);

      const userImage = user.avatar.public_id;

      await cloudinary.v2.uploader.destroy(userImage);

      const avatar = await cloudinary.v2.uploader.upload(fileUpload, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });

      userData.avatar = {
        public_id: avatar.public_id,
        url: avatar.secure_url,
      };
    }

    await User.findByIdAndUpdate(req.user.id, userData, {
      new: true,
      runValidators: true,
      useFindAndModify: true,
    });

    return res
      .status(200)
      .json({ success: true, data: "Update profile successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ sucess: false, data: "Something went wrong" });
  }
};
