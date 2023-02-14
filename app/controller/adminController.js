const User = require('../model/userModel');
const Request = require('../model/requestModel');

/**
 * Get list of users or a user profile
 */
exports.GetUser = async (req, res, next) => {
  const id = req.query.id ? req.query.id : '';
  const role = req.query.role ? req.query.role : '';
  try {
    if (!id) {
      const allUser = await User.find(
        { role: role },
        { name: 1, email: 1, phone_number: 1, createdAt: 1, lastLogined: 1 },
      );
      return res.status(200).json({ success: true, data: allUser });
    }
    const allUser = await User.findById(id, {
      password: 0,
    });
    return res.status(200).json({ success: true, data: allUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, data: 'Error occurred' });
  }
};

/**
 * Create new user
 */
exports.AddNewUser = async (req, res, next) => {
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
  const role = req.body.role ? req.body.role : '';
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
      data: 'Please provide information',
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

/**
 * Delete a user
 */
exports.DeleteUser = async (req, res, next) => {
  const id = req.body.id ? req.body.id : '';
  if (!id) {
    return res
      .status(400)
      .json({ success: false, data: 'Please select user to delete' });
  }
  try {
    const user = await User.findOneAndDelete({ _id: id });
    if (!user) {
      return res.status(404).json({ success: false, data: 'User not found' });
    }
    return res
      .status(200)
      .json({ success: true, data: 'Delete user successfully' });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, data: 'Something went wrong' });
  }
};

/**
 * Get list of requests or a specific request
 */
exports.GetRequests = async (req, res, next) => {
  const id = req.query.id ? req.query.id : '';
  try {
    if (!id) {
      const allRequest = await Request.find();
      return res.status(200).json({ success: true, data: allRequest });
    }
    const allRequest = await Request.findById(id);
    return res.status(200).json({ success: true, data: allRequest });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, data: 'Error occurred' });
  }
};

/**
 * Delete a request
 */
exports.DeleteRequests = async (req, res, next) => {
  const id = req.body.id ? req.body.id : '';
  try {
    const request = await Request.findByIdAndDelete(id);
    if (!request) {
      return res
        .status(200)
        .json({ success: false, data: 'Request not found' });
    }
    return res
      .status(200)
      .json({ success: true, data: 'Delete request successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, data: 'Error occurred' });
  }
};

/**
 * Create new request
 */
exports.CreateRequest = async (req, res, next) => {
  const user_id = req.body.user_id ? req.body.user_id : '';
  const explanation = req.body.explanation ? req.body.explanation : '';
  if (!user_id) {
    return res.status(400).json({ success: false, data: 'Invalid request' });
  }
  try {
    await Request.create({ user_id, explanation });
    return res
      .status(200)
      .json({ success: true, data: 'Create new request successfully' });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, data: 'Something went wrong' });
  }
};
