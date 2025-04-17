const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/connection");
const { User } = require("../models/db");

const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({
          message: "Authorization header missing or improperly formatted",
        });
    }

    const token = header.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      if (!decoded || !decoded.id) {
        return res.status(401).json({ message: "Invalid token content" });
      }

      // Optionally verify user still exists in the database
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(404).json({ message: "User no longer exists" });
      }

      // Set userId for use in route handlers
      req.userId = decoded.id;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      } else if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
      } else {
        return res.status(500).json({ message: "Server error during authentication" });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error during authentication" });
  }
};

module.exports = auth;
