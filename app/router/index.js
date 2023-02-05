const express = require('express');
const { error404Router } = require('../error/routerError');
const userRouter = require('./userRouter');
const adminRouter = require('./adminRouter');
const doctorRouter = require('./doctorRouter');
const accountRouter = require('./accountRouter');
const router = express.Router();

router.use('/api/v1/account', accountRouter);

router.use('/api/v1/doctor', doctorRouter);

router.use('/api/v1/user', userRouter);

router.use('/api/v1/admin', adminRouter);

router.use(error404Router);

module.exports = router;
