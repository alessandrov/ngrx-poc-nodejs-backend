/* eslint-disable linebreak-style */
var server = process.cwd() + "/app/";

var log = require(server + "log")(module);
var db = require(server + "odb/mongoose");
var config = require(server + "config");

var AccessToken = require(server + "model/access-token");
var Book = require(server + "model/book");
var Client = require(server + "model/client");
var RefreshToken = require(server + "model/refresh-token");
var User = require(server + "model/user");

AccessToken.remove({}, function (err) {
  Book.remove({}, function (err) {
    Client.remove({}, function (err) {
      RefreshToken.remove({}, function (err) {
        User.remove({}, function (err) {

          if (!err) {
            const user1 = new User({
              username: "user1",
              password: "password1"
            });

            user1.save(function (err, user1) {
              if (!err) {
                log.info("New User added: " + user1.username);
              } else {
                return log.error(err);
              }
            });

            const user2 = new User({
              username: "user2",
              password: "password2"
            });

            user2.save(function (err, user2) {
              if (!err) {
                log.info("New User added: " + user2.username);

                const client = new Client({
                  name: config.get("default:client:name"),
                  clientId: config.get("default:client:clientId"),
                  clientSecret: config.get("default:client:clientSecret")
                });

                client.save(function (err, client) {
                  if (!err) {
                    log.info("New Client added");
                  } else {
                    return log.error(err);
                  }
                });
              } else {
                return log.error(err);
              }
            });
          } else {
            return log.error(err);
          }
        });

        const book1 = new Book({
          title: "Tree men in a boat",
          author: "Jerome K. Jerome"
        });

        book1.save(function (err, book1) {
          if (!err) {
            log.info("New Book added - %s", book1.title);
          } else {
            return log.error(err);
          }
        });

        const book2 = new Book({
          title: "Captains Courageous",
          author: "Rudyard Kipling"
        });

        book2.save(function (err, book2) {
          if (!err) {
            log.info("New Book added - %s", book2.title);
          } else {
            return log.error(err);
          }
        });

        const book3 = new Book({
          title: "The brave new world",
          author: "Aldous L. Huxley"
        });

        book3.save(function (err, book3) {
          if (!err) {
            log.info("New Book added - %s", book3.title);
          } else {
            return log.error(err);
          }
        });

        const book4 = new Book({
          title: "99 francs",
          author: "Frédéric Beigbeder"
        });

        book4.save(function (err, book4) {
          if (!err) {
            log.info("New Book added - %s", book4.title);
          } else {
            return log.error(err);
          }
        });
      });
    });
  });
})
;

setTimeout(function () {
  db.disconnect();
}, 3000);