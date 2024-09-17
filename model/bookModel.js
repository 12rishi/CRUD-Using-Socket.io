const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bookSchema = new Schema({
  authorName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  publishedAt: {
    type: String,
    required: true,
  },
});
const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
