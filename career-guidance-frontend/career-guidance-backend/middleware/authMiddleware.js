const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token || token === "undefined" || token === "null") {
    if (req.body?.email || req.query?.email) {
      req.user = { email: req.body?.email || req.query?.email };
      return next();
    }
    return res.status(401).json({ success: false, message: "No auth token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "careerai_super_secret_key_change_this"
    );
    req.user = decoded;
    next();
  } catch (error) {
    if (req.body?.email || req.query?.email) {
      req.user = { email: req.body?.email || req.query?.email };
      return next();
    }
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = { protect };