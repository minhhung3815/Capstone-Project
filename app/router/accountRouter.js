const express = require('express');
const router = express.Router();
const account = require('../controller/accountController');

router.post('/register', account.Register);

router.post('/login', account.Login);

module.exports = router;
