const express = require('express');
const router = express.Router();
const Account = require('../controller/accountController');

router.post('/register', Account.Register);

router.post('/login', Account.Login);

module.exports = router;
