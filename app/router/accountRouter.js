const express = require('express');
const router = express.Router();
const account = require('../controller/accountController');
const multer = require('../utils/multer');

router.post('/register', multer.single('avatar'), account.Register);

router.post('/verification', account.EmailVerification);

router.get('/verification/:token', account.EmailVerificationToken);

router.post('/login', account.Login);

module.exports = router;
