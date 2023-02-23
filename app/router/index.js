const express = require('express');
const { error404Router } = require('../error/routerError');
const userRouter = require('./userRouter');
const adminRouter = require('./adminRouter');
const doctorRouter = require('./doctorRouter');
const accountRouter = require('./accountRouter');
const router = express.Router();

router.use('/account', accountRouter);

router.use('/doctor', doctorRouter);

router.use('/user', userRouter);

router.use('/admin', adminRouter);

router.use(error404Router);

module.exports = router;
