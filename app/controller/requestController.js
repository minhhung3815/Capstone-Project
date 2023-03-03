const Request = require('../model/requestModel');

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
