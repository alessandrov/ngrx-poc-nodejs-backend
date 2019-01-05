var crypto = require("crypto");
var oauth2orize = require("oauth2orize");
var passport = require("passport");

var path = require("path");
var server = (path.join(__dirname, ".."));

var config = require(server + "/config");
var log = require(server + "/log")(module);

var AccessToken = require(server + "/model/access-token");
var RefreshToken = require(server + "/model/refresh-token");
var User = require(server + "/model/user");

// oauth2orize server creation
var aserver = oauth2orize.createServer();

var errFn = function (cb, err) {
  if (err) {
    return cb(err);
  }
};

var generateTokens = function (data, done) {
  var errorHandler = errFn.bind(undefined, done),
    refreshToken,
    refreshTokenValue,
    token,
    tokenValue;

  RefreshToken.remove(data, errorHandler);
  AccessToken.remove(data, errorHandler);

  tokenValue = crypto.randomBytes(32).toString("hex");
  refreshTokenValue = crypto.randomBytes(32).toString("hex");

  data.token = tokenValue;
  token = new AccessToken(data);

  data.token = refreshTokenValue;
  refreshToken = new RefreshToken(data);

  refreshToken.save(errorHandler);

  token.save(function (err) {
    if (err) {

      log.error(err);
      return done(err);
    }
    done(null, tokenValue, refreshTokenValue, {
      // "expires_in": config.get("security:token-expiration-seconds"),
      // "user_id": data.userId
    });
  });
};

// returns username and password given the access token.
aserver.exchange(oauth2orize.exchange.password(function (client, username, password, scope, done) {
  User.findOne({username: username}, function (err, user) {
    if (err) {
      return done(err);
    }

    if (!user || !user.checkPassword(password)) {
      return done(null, false);
    }

    var model = {
      userId: user.userId,
      clientId: client.clientId
    };

    generateTokens(model, done);
  });
}));


// returns an access token given the refresh token
aserver.exchange(oauth2orize.exchange.refreshToken(function (client, refreshToken, scope, done) {

  RefreshToken.findOne({token: refreshToken, clientId: client.clientId}, function (err, token) {
    if (err) {
      return done(err);
    }

    if (!token) {
      return done(null, false);
    }

    User.findById(token.userId, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }

      var model = {
        userId: user.userId,
        clientId: client.clientId
      };

      generateTokens(model, done);
    });
  });
}));

exports.token = [
  passport.authenticate(["basic", "oauth2-client-password"], {session: false}),
  aserver.token(),
  aserver.errorHandler()
];
