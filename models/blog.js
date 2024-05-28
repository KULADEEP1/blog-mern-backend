const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  author: { type: String, required: true },
  filename: String,
  contentType: String,
  imageBase64: String,
  publishDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Blog", blogSchema);
