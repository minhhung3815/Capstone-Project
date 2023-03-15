const jwt = require("jsonwebtoken");

exports.isAuthenticatedUser = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, data: "Missing auhtorization header" });
  }
  try {
    const decoded = jwt.verify(token, proccess.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, data: "Invalid token" });
  }
};
