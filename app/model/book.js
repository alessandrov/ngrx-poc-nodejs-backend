var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Book = new Schema({
  title: {type: String, required: true, trim: true},
  author: {type: String, required: true, trim: true},
  modified: {type: Date, default: Date.now}
});

Book.index(
  {title: 1},
  {partialFilterExpression: {title: {$exists: true}}}
)

Book.path("title").validate(function (title) {
  return title.length > 5 && title.length < 70;
});

module.exports = mongoose.model("Book", Book);