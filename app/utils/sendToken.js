const sendToken = async (user, statusCode, res) => {
  const accessToken = await user.getJWTToken();
  const refreshToken = await user.getRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    ),
    domain: "vercel.app",
    httpOnly: true ,
    sercure: true,
  };

  res.cookie("jwt", refreshToken, options);

  res.status(statusCode).json({
    success: true,
    role: user?.role,
    accessToken: accessToken,
  });
};

module.exports = sendToken;
