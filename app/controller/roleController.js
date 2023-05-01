const Role = require("../model/roleModel");

/** Create new role */
exports.CreateRole = async (req, res, next) => {
  const role = req.body.role;
  if (!role) {
    return res.status(400).json({
      success: false,
      data: "Please provide information",
    });
  }
  try {
    await Role.create({ role });
    return res
      .status(200)
      .json({ success: true, data: "Create new role successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ success: false, data: "Role is already existed" });
    }
    return res.status(500).json({ success: false, data: error });
  }
};

/** View all roles in system */
exports.ViewAllRole = async (req, res, next) => {
  try {
    const role = await Role.find();
    return res.status(200).json({ success: true, data: role });
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};
