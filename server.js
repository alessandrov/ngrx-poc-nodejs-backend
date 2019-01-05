"use strict";

var path = require("path");
var appServer = (path.join(__dirname, "/app"));

var app = require(appServer + "/app");
var config = require(appServer + "/config");
var log = require(appServer + "/log")(module);

app.set("port", process.env.PORT || config.get("application-port") || 3000);

var server = app.listen(app.get("port"), function () {
  log.info("Express server listening on port " + app.get("port"));
});

module.exports = server;