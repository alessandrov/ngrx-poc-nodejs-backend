const express = require("express");
const router = express.Router();
const passport = require("passport");

const path = require("path");
const server = (path.join(__dirname, ".."));

const bookService = require(server + "/services/bookService");

// returns all Books
router.get("/", passport.authenticate("bearer", {session: false}), function (req, res) {
  bookService.getBooks().then((response) => {
    return res.status(200).json(response);
  });
});

// creates a Book
router.post("/", passport.authenticate("bearer", {session: false}), function (req, res) {
  bookService.createBook(req.body.payload.title, req.body.payload.author).then((response) => {
    return res.status(response.statusCode).json(response);
  });
});

//returns the Book with the given id
router.get("/:id", passport.authenticate("bearer", {session: false}), function (req, res) {
  bookService.getBookById(req.params.id).then((response) => {
    return res.status(response.statusCode).json(response);
  });
});

//edits a Book
router.put("/:id", passport.authenticate("bearer", {session: false}), function (req, res) {
  bookService.editBook(req.params.id, req.body.title, req.body.author).then((response) => {
    return res.status(response.statusCode).json(response);
  });
});

//patches a Book
router.patch("/:id", passport.authenticate("bearer", {session: false}), function (req, res) {
  bookService.patchBook(req.params.id, req.body.title, req.body.author).then((response) => {
    return res.status(response.statusCode).json(response);
  });
});

//deletes a Book
router.delete("/:id", passport.authenticate("bearer", {session: false}), function (req, res) {
  bookService.deleteBook(req.params.id).then((response) => {
    return res.status(response.statusCode).json(response);
  });
});

module.exports = router;
