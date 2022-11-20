const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/userModel");
const { config } = require("../config/config");
const { createToken } = require("../helpers/userHelper");

const handleRefreshToken = async (req, res) => {
  try {
    console.log(req.cookies)
    const cookies = req.cookies;

    if (!cookies?.jwt) {
      return res.sendStatus(401);
    }
    const refreshToken = cookies.jwt;

    const user = await UserModel.findOne({
      refreshToken,
    }).exec();

    if (!user) {
      return res.sendStatus(403);;
    }

    const decoded = jwt.verify(refreshToken, config.refreshToken);

    if (!decoded || decoded._id !== user._id.toString()) {
      return res.status(403).json({msg:"Forrbiden"});
    }

    const accessToken = createToken(user._id , user.role)

    return res.json({ accessToken });
  } catch (e) {
    return res.status(401).json({ error: "Please authenticate." });
  }
};

module.exports = handleRefreshToken;
