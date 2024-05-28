const express = require("express");
const User = require("../models/user.js");
const { signupUser, loginUser } = require("../controller/user-controller.js");
const {
  createBlog,
  getAllBlogs,
  getBlogData,
  getUserBlogs,
  deleteBlog,
} = require("../controller/blog-controller.js");
const {
  newComment,
  getAllComments,
  deleteComment,
} = require("../controller/comment-controller.js");
const { addLike, removeLike } = require("../controller/like-controller.js");
const { validateToken } = require("../middleware.js");
const jwt = require("jsonwebtoken");
const router = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/signup", signupUser);

router.post("/login", loginUser);

router.post(
  "/create",
  validateToken,
  upload.single("featuredImage"),
  createBlog
);

router.get("/getallblogs", getAllBlogs);

router.get("/viewblog/:id", validateToken, getBlogData);

router.post("/newcomment/:id", newComment);

router.get("/getallcomments/:id", getAllComments);

router.delete("/deletecomment/:id", deleteComment);

router.post("/newlike/:id", validateToken, addLike);

router.delete("/removelike/:id", validateToken, removeLike);

router.post("/userblogs", getUserBlogs);

router.delete("/deleteblog/:id",validateToken,deleteBlog);

router.post("/validate-token", validateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const decodedToken = jwt.decode(req.token);
    const expiryTime = decodedToken.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    const timeLeft = expiryTime - currentTime;
    res.status(201).json({ isValid: true, user, timeLeft });
  } catch (error) {
    res.status(500).json({ message: "Server error", isValid: false });
  }
});

router.post("/refresh-token", validateToken, async (req, res) => {
  const user = req.user;
  const payload = {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  };
  const accessToken = jwt.sign(payload, "jwtSecretkey", { expiresIn: "7d" });
  return res.status(201).json({ accessToken, user });
});
module.exports = router;
