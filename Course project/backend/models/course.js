const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  imgFile: { type: String, required: true },
  date: { type: String, required: false },
  likes: { type: [String], required: false },
  rating: { type: [Object], required: false },
  categories: { type: [String], required: false },
});

module.exports = mongoose.model("Course", postSchema);
