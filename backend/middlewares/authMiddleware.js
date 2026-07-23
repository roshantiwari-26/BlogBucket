const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
      return res.status(401).json({ message: "No token provided" });
    }
    const user = jwt.verify(accessToken, process.env.JWT_SECRET);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = authMiddleware;
