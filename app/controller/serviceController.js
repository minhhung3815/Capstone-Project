const Service = require("../model/serviceModel");

exports.GetAllServices = async (req, res, next) => {
  try {
    const allServices = await Service.find();
    return res.status(200).json({ success: true, data: allServices });
  } catch (error) {
    return res.status(500).json({ success: false, data: "Error occurred" });
  }
};

exports.GetSpecificService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);
    return res.status(200).json({ success: true, data: service });
  } catch (error) {
    return res.status(500).json({ success: false, data: "Error occurred" });
  }
};

exports.CreateNewService = async (req, res, next) => {
  try {
    const { value, price, description } = req.body;
    await Service.create({ value, price, description });
    return res
      .status(200)
      .json({ success: true, data: "Create new service successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, data: "Error occurred" });
  }
};

exports.DeleteService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      return res
        .status(400)
        .json({ success: false, data: "Service not found" });
    }
    return res
      .status(200)
      .json({ success: true, data: "Delete service successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, data: "Error occurred" });
  }
};

exports.UpdateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { value, price, description } = req.body;
    const service = await Service.findByIdAndUpdate(id, {
      value,
      price,
      description,
    });
    if (!service) {
      return res
        .status(400)
        .json({ success: false, data: "Service not found" });
    }
    return res
      .status(200)
      .json({ success: true, data: "Update new service successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, data: "Error occurred" });
  }
};
