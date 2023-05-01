const User = require("../model/userModel");
const Doctor = require("../model/doctorModel");
const InactiveUser = require("../model/inactiveUserModel");
const Specialization = require("../model/doctorModel");
const cloudinary = require("cloudinary");
const sendToken = require("../utils/sendToken");
const { VerificationMail } = require("../utils/sendEmail");
const { hashedPassword } = require("../utils/hashPassword");
const jwt = require("jsonwebtoken");

/******-------------ADMIN--------------- ******/

/** Create new user and admin */
exports.AddNewUserAndAdmin = async (req, res, next) => {
  console.log(req.body);
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
  const id = req.params.id ? req.params.id : "";
  if (!id) {
    return res
      .status(400)
      .json({ success: false, data: "Please select user to delete" });
  }
  try {
    const user = await User.findOneAndDelete({ _id: id });
    if (!user) {
      return res.status(400).json({ success: false, data: "User not found" });
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
  const role = "doctor";
  const description = req.body.description ? req.body.description : "";
  const specialization = req.body.specialization ? req.body.specialization : [];
  const exp = req.body.exp ? req.body.exp : [];
  const achievements = req.body.achievements ? req.body.achievements : [];
  if (
    !name ||
    !email ||
    !gender ||
    !phone_number ||
    !date_of_birth ||
    !password ||
    !role ||
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
    await Doctor.create({
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
      description,
      exp: JSON.parse(exp),
      achievements: JSON.parse(achievements),
      specialization: JSON.parse(specialization),
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
    const user = await Doctor.findByIdAndDelete(id);
    if (!user) {
      return res.status(400).json({ success: false, data: "Doctor not found" });
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
    let user = await User.findOne({ email });
    if (!user) {
      user = await Doctor.findOne({ email });
    }
    if (!user) {
      return res
        .status(400)
        .json({ success: false, data: "Email is not found" });
    }

    const checkPassword = await user.comparePassword(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        success: false,
        data: "Password is incorrect",
      });
    }
    const accessToken = await user.getJWTToken();
    const refreshToken = await user.getRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();
    const options = {
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      domain:
        process.env.NODE_ENV === "development"
          ? "localhost"
          : "frontend-clinic-iota.vercel.app",
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "none",
    };
    res.cookie("jwt", refreshToken, options);
    return res.status(200).json({
      success: true,
      role: user?.role,
      accessToken: accessToken,
      jwt: refreshToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, data: error });
  }
};

/** Register account (user)*/
exports.Register = async (req, res, next) => {
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
  const token = jwt.sign(
    { email: email, role: role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.MAIL_VERIFICATION_EXPIRE,
    },
  );

  const verificationUrl = `${req.protocol}://${req.get(
    "host",
  )}/user/verification/${token}`;
  const verification_email = new VerificationMail(
    email,
    verificationUrl,
    template,
  );
  try {
    const avatar = fileUpload
      ? await cloudinary.v2.uploader.upload(fileUpload.path, {
          folder: "avatar",
          width: 150,
          crop: "scale",
        })
      : { public_id: "", secure_url: "" };
    await Promise.all([
      verification_email.sendEmail(),
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
      // console.log(error);
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
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
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
    const allUser =
      role === "doctor"
        ? await Doctor.find({ role: role }, "-password")
        : await User.find({ role: role }, "-password");
    // console.log(allUser);
    return res.status(200).json({ success: true, data: allUser });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};

/** Get list of users based on role  */
exports.GetAllUserAndAdmin = async (req, res, next) => {
  try {
    const allUser = await User.find({}, "-password");
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
        .status(400)
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
    const user = await Doctor.findById(id);

    if (!user) {
      return res
        .status(400)
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
exports.UpdateUserProfile = async (req, res, next) => {
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
      const user = await User.findById(req.user?.id);

      const userImage = user.avatar.public_id;

      await cloudinary.v2.uploader.destroy(userImage);

      const avatar = await cloudinary.v2.uploader.upload(fileUpload.path, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });

      userData.avatar = {
        public_id: avatar.public_id,
        url: avatar.secure_url,
      };
    }

    await User.findByIdAndUpdate(req.user?.id, userData, {
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

/** Update profile */
exports.UpdateDoctorProfile = async (req, res, next) => {
  const fileUpload = req.file ? req.file : "";
  const {
    name = "",
    phone_number = "",
    gender = "",
    date_of_birth = "",
    description = "",
    exp = [],
    achievements = [],
    specialization = [],
  } = req.body;
  if (!name || !phone_number || !gender || !date_of_birth) {
    return res.status(400).json({ success: false, data: "Bad request" });
  }
  const userData = {
    name,
    phone_number,
    gender,
    date_of_birth: new Date(date_of_birth),
    name,
    description,
    exp: JSON.parse(exp),
    achievements: JSON.parse(achievements),
    specialization: JSON.parse(specialization),
  };
  try {
    if (fileUpload) {
      const user = await User.findById(req.user?.id);

      const userImage = user.avatar.public_id;

      await cloudinary.v2.uploader.destroy(userImage);

      const avatar = await cloudinary.v2.uploader.upload(fileUpload.path, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });

      userData.avatar = {
        public_id: avatar.public_id,
        url: avatar.secure_url,
      };
    }

    await User.findByIdAndUpdate(req.user?.id, userData, {
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

/** Edit user profile */
exports.EditUserProfile = async (req, res, next) => {
  const fileUpload = req.file ? req.file : "";
  const {
    email = "",
    name = "",
    phone_number = "",
    gender = "",
    date_of_birth = "",
  } = req.body;
  const userId = req.params.id;
  if (!email || !name || !phone_number || !gender || !date_of_birth) {
    return res.status(400).json({ success: false, data: "Bad request" });
  }
  const userData = {
    email,
    name,
    phone_number,
    gender,
    date_of_birth: new Date(date_of_birth),
  };
  try {
    if (fileUpload) {
      const user = await User.findById(userId);

      const userImage = user.avatar.public_id;

      await cloudinary.v2.uploader.destroy(userImage);

      const avatar = await cloudinary.v2.uploader.upload(fileUpload.path, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });

      userData.avatar = {
        public_id: avatar.public_id,
        url: avatar.secure_url,
      };
    }

    await User.findByIdAndUpdate(userId, userData, {
      new: true,
      runValidators: true,
      useFindAndModify: true,
    });

    return res
      .status(200)
      .json({ success: true, data: "Update profile successfully" });
  } catch (error) {
    // console.log(error);
    return res
      .status(500)
      .json({ sucess: false, data: "Something went wrong" });
  }
};

/** Edit user profile */
exports.EditDoctorProfile = async (req, res, next) => {
  const fileUpload = req.file ? req.file : "";
  const {
    email = "",
    name = "",
    phone_number = "",
    gender = "",
    date_of_birth = "",
    description = "",
    exp = [],
    achievements = [],
    specialization = [],
  } = req.body;
  const userId = req.params.id;
  if (!email || !name || !phone_number || !gender || !date_of_birth) {
    return res.status(400).json({ success: false, data: "Bad request" });
  }
  const userData = {
    email,
    name,
    phone_number,
    gender,
    date_of_birth: new Date(date_of_birth),
    name,
    description,
    exp: JSON.parse(exp),
    achievements: JSON.parse(achievements),
    specialization: JSON.parse(specialization),
  };
  try {
    if (fileUpload) {
      const user = await Doctor.findById(userId);

      const userImage = user.avatar.public_id;
      if (userImage) {
        await cloudinary.v2.uploader.destroy(userImage);
      }

      const avatar = await cloudinary.v2.uploader.upload(fileUpload.path, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });

      userData.avatar = {
        public_id: avatar.public_id,
        url: avatar.secure_url,
      };
    }

    await Doctor.findByIdAndUpdate(userId, userData, {
      new: true,
      runValidators: true,
      useFindAndModify: true,
    });

    return res
      .status(200)
      .json({ success: true, data: "Update profile successfully" });
  } catch (error) {
    // console.log(error);
    return res
      .status(500)
      .json({ sucess: false, data: "Something went wrong" });
  }
};
