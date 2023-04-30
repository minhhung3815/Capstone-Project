const sendToken = async (user, statusCode, res) => {
  const accessToken = await user.getJWTToken();
  const refreshToken = await user.getRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();
  const options = {
    expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    domain: "frontend-clinic-iota.vercel.app",
    httpOnly: true,
    secure: true,
  };

  res.cookie("jwt", "jklashfkjsfhakjfsahkjsfahksfah", options);
  console.log("Cookie is set");
  res.status(statusCode).json({
    success: true,
    role: user?.role,
    accessToken: accessToken,
  });
};

module.exports = sendToken;
