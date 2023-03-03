const Specialization = require('../model/specializationModel');

exports.GetSpecialization = async (req, res, next) => {
  const id = req.query.id ? req.query.id : '';
  try {
    if (!id) {
      const specialization = await Specialization.find();
      return res.status(200).json({ success: true, data: specialization });
    }
    const specialization = await Specialization.findById(id);
    return res.status(200).json({ success: true, data: specialization });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, data: 'Something went wrong' });
  }
};

exports.CreateNewSpecialization = async (req, res, next) => {
  const { description, specialization, exp, doctor_id } = req.body;
  if (!description || !specialization || !exp || !doctor_id) {
    return res.status(400).json({ success: false, data: 'Error occurred' });
  }
  try {
    await Specialization.create({
      doctor_id,
      description,
      specialization,
      exp,
    });
    return res
      .status(200)
      .json({ success: true, data: 'Create new doctor profile successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, data: 'Something went wrong' });
  }
};

exports.DeleteSpecialization = async (req, res, next) => {
  const id = req.body.id ? req.body.id : '';
  if (!id) {
    return res
      .status(400)
      .json({ success: false, data: 'Please select profile to delete' });
  }
  try {
    const profile = await User.findOneAndDelete({ _id: id });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, data: 'Profile not found' });
    }
    return res
      .status(200)
      .json({ success: true, data: "Delete doctor's profile successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, data: 'Something went wrong' });
  }
};
