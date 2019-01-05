const express = require("express");
const app = express();

//needed by swagger
const argv = require("minimist")(process.argv.slice(2));
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const methodOverride = require("method-override");
const passport = require("passport");

const path = require("path");
const server = (path.join(__dirname));
require(server + "/auth/auth");
require(server + "/odb/mongoose");

const log = require("./log")(module);
const oauth2 = require("./auth/oauth2");
const users = require("./routes/users");
const books = require("./routes/books");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(methodOverride());
app.use(passport.initialize());

/*

SWAGGER CONFIGURATION

 */

const subpath = express();
app.use("/v1", subpath);

app.use(express.static("dist"));

const swagger = require("swagger-node-express").createNew(subpath);
swagger.setApiInfo({
  title: "",
  description: "",
  termsOfServiceUrl: "",
  contact: "yourname@something.com",
  license: "",
  licenseUrl: ""
});

app.get("/", function (req, res) {
  res.sendFile(server + "/dist/index.html");
});

swagger.configureSwaggerPaths("", "api-docs", "");

// Configure the API domain
var domain = "localhost";
if (argv.domain !== undefined) {
  domain = argv.domain;
} else {
  // console.log("No --domain=xxx specified, taking default hostname "localhost".");
}

// Configure the API port for Swagger UI
var port = 8199;
if (argv.port !== undefined) {
  port = argv.port;
} else {
  // console.log("No --port=xxx specified, taking default port " + port + ".");
}

// Set and display the application URL
const applicationUrl = "http://" + domain + ":" + port;
console.log("snapJob API running on " + applicationUrl);

swagger.setAppHandler(app);
swagger.configure(applicationUrl, "1.0.0");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // you might want to change this
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Accept,content-type,application/json");
  next();
});

/*

APP CONFIGURATION

 */

app.use("/api/books", books);
app.use("/api/oauth/token", oauth2.token);
app.use("/api/users", users);

app.use(function (req, res, next) {
  res.status(404);
  log.debug("%s %d %s", req.method, res.statusCode, req.url);
  res.json({
    error: "Not found"
  });
  return;
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  log.error("%s %d %s", req.method, res.statusCode, err.message);
  res.json({
    error: err.message
  });
  return;
});

app.listen(port);

module.exports = app;