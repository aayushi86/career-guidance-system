const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const authHeader =
    req.headers.authorization;

  if (
    !authHeader ||
    !authHeader.startsWith("Bearer ")
  ) {
    return res.status(401).json({
      success: false,
      message:
        "Not authorized. Session token missing.",
    });
  }

  const token =
    authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message:
        "Not authorized. Session token missing.",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ||
        "careerai_super_secret_key_change_this"
    );

    req.user = decoded;

    next();

  } catch (error) {
    console.error(
      "JWT verification failed:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message:
        "Not authorized. Session token invalid or expired.",
    });
  }
};

module.exports = {
  protect,
};