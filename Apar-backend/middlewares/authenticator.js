const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

module.exports = function authenticator(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    //Check if token is provided
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    //Extract token
    const token = authHeader.split(" ")[1]?.trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found in header.",
      });
    }
    //Verify token
    try {
      const decoded = jwt.verify(token, SECRET);

      // Attach decoded user
      req.user = decoded;
      next();
    } catch (err) {
      console.error("❌ JWT Verify Error:", err.message);

      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired. Please log in again.",
        });
      }

      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Invalid token. Please log in again.",
        });
      }

      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  } catch (err) {
    console.error("Authenticator middleware error:", err);
    res.status(500).json({
      success: false,
      message: "Server error in authentication",
      error: err.message,
    });
  }
};
