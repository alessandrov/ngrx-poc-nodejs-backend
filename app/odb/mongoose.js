let mongoose = require("mongoose");

const path = require("path");
const server = (path.join(__dirname, ".."));

const config = require(server + "/config");
const log = require(server + "/log")(module);

mongoose.connect(config.get("mongooseLocal:uri"),
  {
    server: {
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 4000,
      socketOptions: {
        keepAlive: 1
      }
    }
  }
);

const db = mongoose.connection;

db.on("error", function (err) {
  log.error("Connection error:", err.message);
});

db.once("open", function callback() {
  log.info("Connected to DB!");
});

module.exports = mongoose;