"use strict";

var should = require("should");
var expect = require("chai").expect;
var app = require("../server");
var request = require("supertest")(app);

describe("Starting API test", function () {

  it("should require authorization", function (done) {
    request
      .get("/api/books")
      .expect(401)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });

  var auth = {};
  var bookId;
  var userId;

  before(loginUser(auth));

  it("should return existing users", function (done) {
    request
      .get("/api/users")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .set("Authorization", "bearer " + auth.token)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        expect(res.body).not.to.be.empty;
        userId = res.body[0]._id;
        app.close();
        done();
      });
  });

  it("should return existing books", function (done) {
    request
      .get("/api/books")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .set("Authorization", "bearer " + auth.token)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        expect(res.body).not.to.be.empty;
        app.close();
        done();
      });
  });

  it("should create a new book", function (done) {
    request
      .post("/api/books")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .set("Authorization", "bearer " + auth.token)
      .send({"title": Date.now().toString()})
      .send({"author": Date.now().toString()})
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        bookId = res.body.book._id;
        expect(res.body.book).to.exist;
        app.close();
        done();
      });
  });

  it("should edit a book", function (done) {
    request
      .put("/api/books/" + bookId)
      .set("Content-Type", "application/x-www-form-urlencoded")
      .set("Authorization", "bearer " + auth.token)
      .send({"title": "New Title"})
      .send({"author": "New Author"})
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        app.close();
        done();
      });
  });

  it("should patch a book", function (done) {
    const newBookTitle = Date.now().toString();
    request
      .patch("/api/books/" + bookId)
      .set("Content-Type", "application/x-www-form-urlencoded")
      .set("Authorization", "bearer " + auth.token)
      .send({"title": newBookTitle})
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.book.title.should.be.equal(newBookTitle);
        app.close();
        done();
      });
  });

  it("should delete a book", function (done) {
    request
      .delete("/api/books/" + bookId)
      .set("Content-Type", "application/x-www-form-urlencoded")
      .set("Authorization", "bearer " + auth.token)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        app.close();
        done();
        process.exit();
      });
  });

});

function loginUser(auth) {
  return function (done) {
    request
      .post("/api/oauth/token")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send("grant_type=password&client_id=client_id&client_secret=client_secret&username=user1&password=password1")
      .expect(200)
      .end(onResponse);

    function onResponse(err, res) {
      if (err) return done(err);
      auth.token = res.body.access_token;
      return done();
    }
  };
};