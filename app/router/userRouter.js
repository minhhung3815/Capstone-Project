const express = require('express');
const router = express.Router();
const user = require('../controller/userController');
const multer = require('../utils/multer');

router.post('/create/account', multer.single('avatar'), user.AddNewUser);

router.get('/account/:role', user.GetUser);

router.delete('/remove/account', user.DeleteUser);

router.post('/register', multer.single('avatar'), user.Register);

router.post('/verification', user.EmailVerification);

router.get('/verification/:token', user.EmailVerificationToken);

router.post('/login', user.Login);

module.exports = router;
