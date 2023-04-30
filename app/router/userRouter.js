const express = require("express");
const router = express.Router();
const user = require("../controller/userController");
const multer = require("../utils/multer");
const emailExisted = require("../middleware/checkExistedEmail");
const auth = require("../middleware/auth");

/** Create new user account - ADMIN */
router.post(
  "/create/account",
  auth.isAuthenticatedUser,
  multer.single("image"),
  user.AddNewUserAndAdmin,
);

/** Create new user account - ADMIN */
router.put(
  "/update/profile",
  auth.isAuthenticatedUser,
  multer.single("image"),
  user.UpdateUserProfile,
);

/** Create new user account - ADMIN */
router.put(
  "/update/doctor/profile",
  auth.isAuthenticatedUser,
  multer.single("image"),
  user.UpdateDoctorProfile,
);

router.put(
  "/edit/user/:id",
  auth.isAuthenticatedUser,
  multer.single("image"),
  user.EditUserProfile,
);

router.put(
  "/edit/doctor/:id",
  auth.isAuthenticatedUser,
  multer.single("image"),
  user.EditDoctorProfile,
);

/** Create new doctor */
router.post(
  "/create/doctor",
  auth.isAuthenticatedUser,
  multer.single("image"),
  user.AddNewDoctor,
);

/** Get list of user by role - ADMIN */
router.get("/account/:role", auth.isAuthenticatedUser, user.GetUser);

/** Get list of user by role - ADMIN */
router.get(
  "/list/all/account",
  auth.isAuthenticatedUser,
  user.GetAllUserAndAdmin,
);

/** Get user and admin detail profile */
router.get(
  "/account/detail/:id",
  auth.isAuthenticatedUser,
  user.GetUserAndAdminDetails,
);

/** Get doctor detail profile */
router.get(
  "/doctor/detail/:id",
  auth.isAuthenticatedUser,
  user.GetDoctorDetail,
);

/** Delete user and admin */
router.delete(
  "/remove/account/:id",
  auth.isAuthenticatedUser,
  user.DeleteUserAndAdmin,
);

/** Delete doctor with specialization */
router.delete(
  "/remove/doctor/:id",
  auth.isAuthenticatedUser,
  user.DeleteDoctor,
);

/** User register */
router.post(
  "/register",
  multer.single("image"),
  emailExisted.checkExistedEmail,
  user.Register,
);

/** Get verified email token */
router.get("/verification/:token", user.EmailVerificationToken);

/** Login */
router.post("/login", user.Login);

module.exports = router;
