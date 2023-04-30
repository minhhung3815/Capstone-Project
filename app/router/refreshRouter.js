const express = require("express");
const router = express.Router();
const refresh = require("../controller/refreshTokenController");

router.get("/", refresh.handleRefreshToken);

module.exports = router;
