const express = require("express");

const path = require("path");
const server = (path.join(__dirname, ".."));

const oauth2 = require(server + "auth/oauth2");
const router = express.Router();

router.post("/token", oauth2.token);

module.exports = router;