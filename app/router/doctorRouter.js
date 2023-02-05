const express = require('express');
const router = express.Router();

router.get('/abc', (req, res, next) => {
  return res.send({ a: 'wqepoweq09123480412' });
});

module.exports = router;
