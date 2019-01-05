const nconf = require("nconf");

const path = require("path");
const server = (path.join(__dirname, ".."));

nconf.argv()
  .env()
  .file({
    file: server + "/config.json"
  });

module.exports = nconf;