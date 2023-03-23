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

router.get(
  "/account/detail/:id",
  auth.isAuthenticatedUser,
  user.GetUserAndAdminDetails,
);

router.get(
  "/doctor/detail/:id",
  auth.isAuthenticatedUser,
  user.GetDoctorDetail,
);

router.delete(
  "/remove/account/:id",
  auth.isAuthenticatedUser,
  user.DeleteUserAndAdmin,
);

router.delete(
  "/remove/doctor/:id",
  auth.isAuthenticatedUser,
  user.DeleteDoctor,
);

router.post(
  "/register",
  multer.single("image"),
  emailExisted.checkExistedEmail,
  user.Register,
);

router.get("/verification/:token", user.EmailVerificationToken);

router.post("/login", user.Login);

module.exports = router;
