const jwt = require("jsonwebtoken");

exports.isAuthenticatedUser = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, data: "Missing auhtorization header" });
  }
  try {
    const decoded = jwt.verify(token.slice(7), process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, data: "Invalid token" });
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({
        success: false,
        data: `Role: ${req.user?.role} is not allowed`,
      });
    }
    next();
  };
};
