const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  imgFile: { type: String, required: true },
  date: { type: String, required: false },
  likes: { type: [String], required: false },
  rating: { type: [Object], required: false },
  // categories: { type: [String], required: false },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
});
// for likes 
// https://stackoverflow.com/questions/12994594/how-should-i-store-likes-dislikes-and-rating-in-mongoose-mongdb-using-node-js/12995406
module.exports = mongoose.model("Course", postSchema);
