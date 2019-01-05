const winston = require("winston");

const path = require("path");
const server = (path.join(__dirname, ".."));

winston.emitErrs = true;

function logger(module) {
  return new winston.Logger({
    transports: [
      new winston.transports.File({
        level: "info",
        filename: server + "/logs/global.log",
        handleException: true,
        json: true,
        maxSize: 5242880, //5mb 
        maxFiles: 2,
        colorize: false
      }),
      new winston.transports.Console({
        level: "debug",
        label: getFilePath(module),
        handleException: true,
        json: false,
        colorize: true
      })
    ],
    exitOnError: false
  });
}

function getFilePath(module) {
  return module.filename.split("/").slice(-2).join("/");
}

module.exports = logger;
