const express = require("express");
const router = express.Router();
const refresh = require("../controller/refreshTokenController");

router.post("/", refresh.handleRefreshToken);

module.exports = router;
