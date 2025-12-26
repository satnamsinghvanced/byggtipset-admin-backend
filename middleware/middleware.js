const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

const auth = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res
        .status(700)
        .json({ message: "Authorization Token is Missing" });
    }

    // Strip "Bearer " if present
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trim();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded || !decoded.id) {
        return res
          .status(700)
          .json({ message: "Token is invalid: ID not found" });
      }

      // Backend check: Verify if the admin actually exists in the database
      const admin = await Admin.findById(decoded.id);
      if (!admin) {
        return res
          .status(700)
          .json({ message: "Unauthorized: Admin not found" });
      }

      req.user = decoded;
      next();
    } catch (err) {
      return res.status(700).json({ message: "Invalid or expired token" });
    }
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = auth;
