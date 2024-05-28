const Comment = require("../models/comment");

const newComment = async (req, res) => {
  try {
    const { currentUser, text } = req.body;
    const blogId = req.params.id;
    const newcomment = new Comment({
      author: currentUser,
      text,
      blogId,
      date: new Date(),
    });
    await newcomment.save();
    res.status(201).json({ message: "Comment added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error while creating new comment" });
  }
};

const getAllComments = async (req, res) => {
  try {
    const allComments = await Comment.find({ blogId: req.params.id });
    res.status(201).json(allComments);
  } catch (error) {
    res.status(500).json({ error: "Error while getting all comments" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const result = await Comment.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "comment not found" });
    }
    return res.status(201).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error while deleting comments from server side" });
  }
};

module.exports = { newComment, getAllComments, deleteComment };
