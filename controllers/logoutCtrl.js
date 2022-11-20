
const { UserModel } = require("../models/userModel");

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  //need to delet access token in client side as well
  try {
    if (!cookies?.jwt || cookies.jwt === "" || cookies.jwt === null || cookies.jwt === undefined) {
      return res.sendStatus(204);
    }
    const refreshToken = cookies.jwt;

    const user = await UserModel.findOne({ refreshToken }).exec();

    if (!user) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return res.status(204).json({msg :"Cookie deleted successfully."});
    }
    // delete in DB
    user.refreshToken = ''
    const result = await user.save();
    console.log(result);

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    return res.status(204).send("Cookie deleted successfully.");
  } catch (e) {
    return res.status(204).send("Please authenticate.");
  }
};

module.exports = handleLogout;
