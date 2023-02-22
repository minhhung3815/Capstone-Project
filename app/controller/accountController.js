const User = require('../model/userModel');
const sendToken = require('../utils/sendToken');
const cloudinary = require('cloudinary');
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');

exports.Register = async (req, res, next) => {
  const fileUpload = req.file ? req.file : '';
  const name = req.body.name ? req.body.name : '';
  const email = req.body.email ? req.body.email : '';
  const password = req.body.password ? req.body.password : '';
  const gender = req.body.gender ? req.body.gender : '';
  const phone_number = req.body.phone_number ? req.body.phone_number : '';
  const date_of_birth = req.body.date_of_birth
    ? new Date(req.body.date_of_birth)
    : '';
  const address = req.body.address ? req.body.address : '';
  const identity_card = req.body.identity_card ? req.body.identity_card : '';
  const role = req.body.role ? req.body.role : 'User';
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
      data: 'Please provide valid fields',
    });
  }
  try {
    const avatar = await cloudinary.v2.uploader.upload(fileUpload.path, {
      folder: 'avatar',
      width: 150,
      crop: 'scale',
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
      data: 'Create account successfully',
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        data: 'Email is already existed',
      });
    }
    return res.status(500).json({
      success: false,
      data: 'Something went wrong',
    });
  }
};

exports.Login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      data: 'Please provide valid fields',
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, data: 'Email is not found' });
    }

    const checkPassword = await user.comparePassword(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        success: false,
        data: 'Password is incorrect',
      });
    }
    sendToken(user, 200, res);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, data: 'Something went wrong' });
  }
};

exports.EmailVerification = async (req, res, next) => {
  const email = req.body.email ? req.body.email : '';
  if (!email) {
    return res
      .status(400)
      .json({ success: false, data: 'Please provide valid information' });
  }
  try {
    const subject = 'Email Verification';
    const token = jwt.sign({ data: 'Token Data' }, process.env.JWT_SECRET, {
      expiresIn: '10m',
    });
    const verificationUrl = `${req.protocol}://${req.get(
      'host',
    )}/api/v1/account/verification/${token}`;
    const data = `Hi! There, You have recently visited 
    our website and entered your email.
    Please follow the given link to verify your email
    ${verificationUrl} 
    Thanks`;
    const options = { email, subject, data };
    await sendEmail(options);
    return res
      .status(200)
      .json({ success: true, data: 'Email has already sent to user' });
  } catch (error) {
    return res.status(500).json({ success: false, data: 'Error occurred' });
  }
};

exports.EmailVerificationToken = async (req, res, next) => {
  const { token } = req.params;
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ success: true, data: 'Email is verified' });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, data: 'Email verification link is expired' });
  }
};
