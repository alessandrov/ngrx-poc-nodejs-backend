const path = require("path");
const server = (path.join(__dirname, ".."));

const log = require(server + "/log")(module);
const messages = require("../../messages");

const Book = require(server + "/model/book");

const jsonPatch = require("fast-json-patch");

const getBooks = function () {
  return new Promise((resolve, reject) => {
    Book.find(function (err, books) {
      if (!err) {
        resolve(books);
      } else {
        reject(err);
      }
    });
  });
};

const createBook = function (bookTitle, bookAuthor) {
  return new Promise((resolve, reject) => {
    let book = new Book({
      title: bookTitle,
      author: bookAuthor
    });

    book.save(function (err) {
      if (!err) {
        const response = {
          book: book,
        };
        response.statusCode = 200;
        resolve(response);
      } else {
        if (err.name === "ValidationError") {
          const response = {
            error: messages.validationError
          };
          response.statusCode = 400;
          resolve(response);
        } else {
          const response = {
            error: messages.serverError
          };
          response.statusCode = 500;
          log.error("Internal error(%d): %s", response.statusCode, err.message);
          resolve(response);
        }
      }
    });
  });
};

const getBookById = function (bookId) {
  return new Promise((resolve, reject) => {
    Book.findById(bookId, function (err, book) {
      if (!book) {
        const response = {
          error: messages.bookNotFound
        };
        response.statusCode = 404;
        resolve(response);
      }

      if (!err) {
        const response = {
          book: book
        };
        response.statusCode = 200;
        resolve(response);
      } else {
        const response = {
          error: messages.serverError
        };
        response.statusCode = 500;
        log.error("Internal error(%d): %s", response.statusCode, err.message);
        resolve(response);
      }
    });
  });
};

const deleteBook = function (bookId) {
  return new Promise((resolve, reject) => {
    Book.findByIdAndRemove(bookId, function (err, book) {
      if (!book) {
        const response = {
          error: messages.bookNotFound
        };
        response.statusCode = 404;
        resolve(response);
      }

      if (!err) {
        const response = {
          message: messages.bookDeletedOk
        };
        response.statusCode = 200;
        resolve(response);
      } else {
        const response = {
          error: messages.serverError
        };
        response.statusCode = 500;
        log.error("Internal error(%d): %s", response.statusCode, err.message);
        resolve(response);
      }
    });
  });
};

const editBook = function (bookId, title, author) {
  return new Promise((resolve, reject) => {
    Book.findById(bookId, function (err, book) {
      if (!book) {
        const response = {
          error: messages.bookNotFound
        };
        response.statusCode = 404;
        resolve(response);
      }

      if (!err) {
        book.title = title;
        book.author = author;

        book.save(function (err) {
          if (!err) {
            const response = {
              message: messages.bookUpdatedOk
            };
            response.statusCode = 200;
            resolve(response);
          } else {
            if (err.name === "ValidationError") {
              const response = {
                message: messages.validationError
              };
              response.statusCode = 400;
              resolve(response);
            } else {
              const response = {
                error: messages.serverError
              };
              response.statusCode = 500;
              log.error("Internal error(%d): %s", response.statusCode, err.message);
              resolve(response);
            }
          }
        });
      } else {
        const response = {
          error: messages.serverError
        };
        response.statusCode = 500;
        log.error("Internal error(%d): %s", response.statusCode, err.message);
        resolve(response);
      }
    });
  });
};

const patchBook = function (bookId, patchedTitle, patchedAuthor) {
  return new Promise((resolve, reject) => {
    Book.findById(bookId, function (err, book) {
      if (!book) {
        const response = {
          error: messages.bookNotFound
        };
        response.statusCode = 404;
        resolve(response);
      }

      const patch = [
        { op: "replace", path: "/title", value: (patchedTitle)?patchedTitle:book.title },
        { op: "replace", path: "/author", value: (patchedAuthor)?patchedAuthor:book.author }
      ];
      book = jsonPatch.applyPatch(book, patch).newDocument;

      book.save(function (err) {
        if (!err) {
          const response = {
            book: book,
            message: messages.bookPatchedOk
          };
          response.statusCode = 200;
          resolve(response);
        } else {
          if (err.name === "ValidationError") {
            const response = {
              error: messages.validationError
            };
            response.statusCode = 400;
            resolve(response);
          } else {
            const response = {
              error: messages.serverError
            };
            response.statusCode = 500;
            log.error("Internal error(%d): %s", response.statusCode, err.message);
            resolve(response);
          }
        }
      });
    });
  });
};

module.exports = {
  createBook: createBook,
  deleteBook: deleteBook,
  editBook: editBook,
  getBookById: getBookById,
  getBooks: getBooks,
  patchBook: patchBook
};