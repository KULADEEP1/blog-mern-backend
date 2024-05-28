const Blog = require("../models/blog");
const Like = require("../models/like.js");

const createBlog = async (req, res) => {
  const { title, content, category } = req.body;

  try {
    const newBlog = new Blog({
      title,
      content,
      category,
      author: req.user.username,
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      imageBase64: req.file.buffer.toString("base64"),
      publishDate: new Date(),
    });

    await newBlog.save();
    res.status(201).json({ message: "Blog post created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error while creating the blog post" });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(201).json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Error while fetching blog posts" });
  }
};

const getBlogData = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    const isLiked = await Like.exists({
      blogId: req.params.id,
      userId: req.user.id,
    });

    const username = req.user.username;
    res.status(201).json({ blog, username, isLiked });
  } catch (error) {
    res.status(500).json({ error: "Error while fetching blog post" });
  }
};

const getUserBlogs = async (req, res) => {
  try {
    const { username } = req.body;
    const blogsData = await Blog.find({ author: username });
    if (blogsData) {
      res.status(201).json(blogsData);
    } else {
      res.status(404).json({ error: "No blogs found for this user" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error while getting user blogs" });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const result = await Blog.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }
    return res.status(201).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error while deleting blog." });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogData,
  getUserBlogs,
  deleteBlog,
};
