const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

const signupUser = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    let exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ msg: "User already exists" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    const newUser = new User({
      username,
      email,
      password,
      confirmPassword,
    });
    await newUser.save();
    return res.status(201).json({ msg: "Signup Successful" });
  } catch (error) {
    return res.status(500).json({ msg: "Error while signing up user" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }
    if (user.password !== password) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate JWT token with user data
    const payload = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
    jwt.sign(payload, "jwtSecretkey", { expiresIn: "7d" }, (err, token) => {
      if (err) {
        return res.status(500).json({ msg: "Error while logging in user" });
      }
      return res.status(201).json({ token, user });
    });
  } catch (error) {
    return res.status(500).json({ msg: "Error while logging in user" });
  }
};

module.exports = { signupUser, loginUser };
