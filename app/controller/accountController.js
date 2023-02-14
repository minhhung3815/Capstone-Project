const User = require('../model/userModel');

exports.Register = async (req, res, next) => {
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
  const role = req.body.role ? req.body.role : 3;
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
      data: 'Please provide valid fields',
    });
  }
  try {
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
    });

    return res.status(200).json({
      success: true,
      data: 'Create account successfully',
    });
  } catch (err) {
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
    return res.status(200).json({
      success: true,
      data: 'Login successfully',
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, data: 'Something went wrong' });
  }
};
