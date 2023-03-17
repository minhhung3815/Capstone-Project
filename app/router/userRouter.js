const express = require("express");
const router = express.Router();
const user = require("../controller/userController");
const multer = require("../utils/multer");
const emailExisted = require("../middleware/checkExistedEmail");

/** Create new user account - ADMIN */
router.post("/create/account", multer.single("image"), user.AddNewUser);

/** Get list of user by role - ADMIN */
router.get("/account/:role", user.GetUser);

router.delete("/remove/account", user.DeleteUser);

router.post(
  "/register",
  emailExisted.checkExistedEmail,
  multer.single("image"),
  user.Register,
);

router.get("/verification/:token", user.EmailVerificationToken);

router.post("/login", user.Login);

module.exports = router;
