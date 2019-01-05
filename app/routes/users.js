const express = require("express");

const passport = require("passport");
const router = express.Router();

const path = require("path");
const server = (path.join(__dirname, ".."));
const User = require(server + "/model/user");

const messages = require("../../messages");

//returns all users
router.get("/", passport.authenticate("bearer", {session: false}), function (req, res) {
  User.find(function (err, users) {
    if (!err) {
      return res.status(200).json(users);
    } else {
      log.error("Internal error(%d): %s", res.statusCode, err.message);

      return res.status(500).json({
        error: messages.serverError
      });
    }
  });
});

module.exports = router;