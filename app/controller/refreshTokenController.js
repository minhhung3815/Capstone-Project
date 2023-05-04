const User = require("../model/userModel");
const Doctor = require("../model/doctorModel");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req?.body;
  // const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ cookies });
  const refreshToken = cookies.jwt;

  let foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    foundUser = await Doctor.findOne({ refreshToken }).exec();
  }
  if (!foundUser) return res.sendStatus(403); //Forbidden
  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.email !== decoded.email) return res.sendStatus(403);
    const role = foundUser.role;
    const accessToken = foundUser.getJWTToken();
    const username = foundUser.name;
    const email = foundUser.email;
    const id = foundUser._id;
    res.json({ role, accessToken, username, email, id });
  });
};

module.exports = { handleRefreshToken };
