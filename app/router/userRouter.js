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

router.post(
  "/create/doctor",
  auth.isAuthenticatedUser,
  multer.single("image"),
  user.AddNewDoctor,
);

/** Get list of user by role - ADMIN */
router.get("/account/:role", auth.isAuthenticatedUser, user.GetUser);

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

/** Create new account as user role */
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
