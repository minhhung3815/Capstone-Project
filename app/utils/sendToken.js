const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();
  const sendUserData = { id: user._id, name: user.name, role: user.role };
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    ),
    httpOnly: false,
  };
  return res.status(statusCode).cookie("token", token, options).json({
    success: true,
    sendUserData,
    token,
  });
};

module.exports = sendToken;
