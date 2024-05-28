const Like = require("../models/like.js");

const addLike = async (req, res) => {
  try {
    const  blogId  = req.params.id;
    const newLike = new Like({
      blogId,
      userId: req.user.id,
    });
    await newLike.save();
    res.status(201).json({ message: "Like Added Successfully !." });
  } catch (error) {
    res.status(500).json("Error while adding like from server side.");
  }
};

const removeLike = async (req, res) => {
  try {
    const blogId = req.params.id;
    const result = await Like.deleteOne({ blogId, userId: req.user.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Like not found" });
    }
    return res.status(201).json({ message: "Like Removed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error while removing like from server side.." });
  }
};

module.exports = { addLike, removeLike };
