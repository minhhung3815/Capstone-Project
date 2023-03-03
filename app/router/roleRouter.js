const express = require('express');
const router = express.Router();
const role = require('../controller/roleController');

router.route('/').get(role.ViewAllRole).post(role.CreateRole);

module.exports = router;
