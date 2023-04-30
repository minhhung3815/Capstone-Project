const sendToken = async (user, statusCode, res) => {
  const accessToken = user.getJWTToken();
  const refreshToken = user.getRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    ),
    httpOnly: false,
  };

  res.cookie("jwt", refreshToken, options);

  res.status(statusCode).json({
    success: true,
    role: user?.role,
    accessToken: accessToken,
  });
};

module.exports = sendToken;
