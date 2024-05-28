const jwt = require("jsonwebtoken");

const validateToken = function (req, res, next) {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(400).send("Token not found");
    }
    let decode = jwt.verify(token, "jwtSecretkey");
    req.user = decode.user;
    req.token = token;
    next();
  } catch (error) {
    return res.status(500).send("Invalid token");
  }
};

module.exports = { validateToken };
