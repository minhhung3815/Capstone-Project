// const Specialization = require("../model/doctorModel");

// exports.GetAllSpecialization = async (req, res, next) => {
//   try {
//     const specialization = await Specialization.find();
//     return res.status(200).json({ success: true, data: specialization });
//   } catch (error) {
//     return res.status(500).json({ success: false, data: error });
//   }
// };

// exports.GetSpecialization = async (req, res, next) => {
//   const id = req.query.id ? req.query.id : "";
//   try {
//     const specialization = await Specialization.findById(id);
//     if (!specialization) {
//       return res
//         .status(400)
//         .json({ success: false, data: "Invalid specialization id" });
//     }
//     return res.status(200).json({ success: true, data: specialization });
//   } catch (error) {
//     return res.status(500).json({ success: false, data: error });
//   }
// };

// exports.CreateNewSpecialization = async (req, res, next) => {
//   const { description, specialization, exp, doctor_id } = req.body;
//   if (!description || !specialization || !exp || !doctor_id) {
//     return res.status(400).json({ success: false, data: "Error occurred" });
//   }
//   try {
//     await Specialization.create({
//       doctor_id,
//       description,
//       specialization,
//       exp,
//     });
//     return res
//       .status(200)
//       .json({ success: true, data: "Create new doctor profile successfully" });
//   } catch (error) {
//     return res.status(500).json({ success: false, data: error });
//   }
// };

// exports.DeleteSpecialization = async (req, res, next) => {
//   const id = req.params.id ? req.params.id : "";
//   if (!id) {
//     return res
//       .status(400)
//       .json({ success: false, data: "Please select profile to delete" });
//   }
//   try {
//     const profile = await User.findOneAndDelete({ _id: id });
//     if (!profile) {
//       return res
//         .status(400)
//         .json({ success: false, data: "Profile not found" });
//     }
//     return res
//       .status(200)
//       .json({ success: true, data: "Delete doctor's profile successfully" });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ success: false, data: error });
//   }
// };
