const { request } = require("express");
const Request = require("../model/requestModel");

/** Get list of requests */
exports.GetRequests = async (req, res, next) => {
  try {
    const allRequest = await Request.find();
    return res.status(200).json({ success: true, data: allRequest });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, data: error });
  }
};

/** Delete a request */
exports.DeleteRequests = async (req, res, next) => {
  const id = req.params.id ? req.params.id : "";
  try {
    const request = await Request.findByIdAndDelete(id);
    if (!request) {
      return res
        .status(200)
        .json({ success: false, data: "Request not found" });
    }
    return res
      .status(200)
      .json({ success: true, data: "Delete request successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, data: error });
  }
};

/** Create new request*/
exports.CreateRequest = async (req, res, next) => {
  const user_id = req.user.id ? req.user.id : "";
  const explanation = req.body.explanation ? req.body.explanation : "";
  if (!user_id) {
    return res.status(400).json({ success: false, data: "Invalid request" });
  }
  try {
    await Request.create({ user_id, explanation });
    return res
      .status(200)
      .json({ success: true, data: "Create new request successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, data: error });
  }
};

/** Edit request */
exports.EditRequest = async (req, res, next) => {
  const { id } = req.params;
  const { accepted } = req.body;
  if (!accepted || !id) {
    return res.status(400).json({ success: false, data: "Invalid request" });
  }
  try {
    await Request.findByIdAndUpdate(
      id,
      { accepted: accepted },
      { new: true, runValidators: true },
    );
    return res
      .status(200)
      .json({ success: true, data: "Update request successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};

/** Get user's requests */
exports.GetUserRequests = async (req, res, next) => {
  const user_id = req.user.id;
  try {
    const requests = await Request.find({ user_id: user_id }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ success: true, data: requests });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};

/** Get specific request */
exports.GetSpecificRequest = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, data: "Invalid request" });
  }
  try {
    const request = await Request.findById(id)
      .populate("user_id", "name role")
      .exec();
    return res.status(200).json({ success: true, data: request });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};
