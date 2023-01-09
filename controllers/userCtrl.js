const { UserModel } = require("../models/userModel");
const { config } = require("../config/config");
const { validateUser } = require("../validations/userValid");
const { createToken } = require("../helpers/userHelper");
const cloudinary = require("cloudinary").v2;

exports.userCtrl = {
  checkToken: async (req, res) => {
    res.json(req.tokenData);
  },
  infoById: async (req, res) => {
    try {
      let id = req.params.id;
      let userInfo = await UserModel.findOne({ _id: id }, { password: 0 });
      if (!userInfo) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json({ userInfo });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "err", err });
    }
  },
  infoByIdWithToken: async (req, res) => {
    try {
      let id = req.params.id;
      let userInfo = await UserModel.findOne({ _id: id }, { password: 0 });
      console.log(userInfo);
      if (!userInfo) {
        return res.status(404).json({ message: "User not found" });
      }
      let newAccessToken = await createToken(userInfo._id, userInfo.role);
      return res.json({ userInfo, newAccessToken });
    } catch (err) {
      return res.status(500).json({ msg: "err", err });
    }
  },
  getUsersList: async (req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 10;
    let page = req.query.page || 1;
    let sort = req.query.sort || "role";
    let reverse = req.query.reverse == "yes" ? -1 : 1;
    try {
      let data = await UserModel.find(
        { _id: { $ne: config.superID } },
        { password: 0 }
      )
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse });
      return res.json(data);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "err", err });
    }
  },
  countUsers: async (req, res) => {
    try {
      let count = await UserModel.countDocuments({});
      res.json({ count });
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  changeRole: async (req, res) => {
    try {
      let userID = req.params.userID;
      if (userID == config.superID) {
        return res
          .status(401)
          .json({ msg: "You cant change Superadmin to user" });
      }
      let user = await UserModel.findOne({ _id: userID });
      user.role = user.role == "admin" ? "user" : "admin";
      user.updatedAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
      user.save();
      return res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "err", err });
    }
  },

  changeActive: async (req, res) => {
    try {
      let userID = req.params.userID;
      if (userID == config.superID) {
        return res
          .status(401)
          .json({ msg: "You cant change superadmin to user" });
      }
      let user = await UserModel.findOne({ _id: userID });
      user.active = !user.active;
      user.updatedAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
      user.save();
      return res.json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  delete: async (req, res) => {
    try {
      let idDel = req.params.idDel;
      let userInfo;

      if (req.tokenData.role == "admin") {
        userInfo = await UserModel.deleteOne({ _id: idDel }, { password: 0 });
      } else if (req.tokenData._id === idDel) {
        userInfo = await UserModel.deleteOne(
          { _id: req.tokenData._id },
          { password: 0 }
        );
      } else {
        return res.status(401).json({ msg: "Not allowed" });
      }
      res.json(userInfo);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },
  edit: async (req, res) => {
    let userValid = validateUser(req.body);
    if (!userValid) {
      return res.status(400).json({ msg: "Need to send valid body" });
    }
    try {
      let idEdit = req.params.idEdit;
      let user;
      if (req.body.email || req.body.password) {
        return res
          .status(401)
          .json({ msg: "email/pasword change is not allowed" });
      }
      if (req.tokenData.role === "admin") {
        user = await UserModel.updateOne({ _id: idEdit }, req.body);
      } else if (idEdit != req.tokenData._id) {
        res.sendStatus(401);
      } else {
        user = await UserModel.updateOne(
          { _id: idEdit, _id: req.tokenData._id },
          req.body
        );
      }
      // else{ throw new Error}
      return res.status(200).json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "err", err });
    }
  },
  rankUser: async (req, res) => {
    let rankedUserId = req.params.userID;
    const rnk = req.body.rnk;
    if (rnk > 5) {
      return res.status(401).json({ msg: "Cant rank more than 5" });
    }
    if (rankedUserId === req.tokenData._id)
      return res.status(401).json({ msg: "You can't rank yourself" });
    try {
      let user = await UserModel.findOne({
        $and: [{ _id: rankedUserId }, { _id: { $ne: req.tokenData._id } }],
      });
      let found = user.rank.some((el) => el.user_id === req.tokenData._id);
      if (!found) {
        user.rank.push({ user_id: req.tokenData._id, rank: rnk });
        await user.save();
        res.status(201).json({ msg: "rank succeed" });
      } else {
        user.rank.map((el) => {
          if (el.user_id === req.tokenData._id) el.rank = rnk;
        });
        await user.save();
        return res.status(201).json({ msg: "rank override succeed" });
      }
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ msg: "Not possible to rank at this time", err });
    }
  },
  avgRank: async (req, res) => {
    let rankedUserId = req.params.userID;
    let rankingUser = req.query?.rankingUser;
    try {
      let user = await UserModel.findOne({ _id: rankedUserId });
      let userRanked = user.rank.find((el) => el.user_id === rankingUser);
      let userRank = 0;
      if (userRanked) user.rank.userRank = userRanked.rank;
      let ranks = user.rank.map((el) => el.rank);
      const average = ranks.reduce((a, b) => a + b, 0) / ranks.length;
      return res.status(200).json({ average, userRank: user.rank.userRank });
    } catch (err) {
      return res
        .status(500)
        .json({ msg: "Error occured try again later", err });
    }
  },
  userSearch: async (req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 10;
    let page = req.query.page || 1;
    let sort = req.query.sort || "role";
    let reverse = req.query.reverse == "yes" ? -1 : 1;
    try {
      let searchQ = req.query?.s;
      let searchReg = new RegExp(searchQ, "i");
      let users = await UserModel.find(
        {
          $and: [
            { _id: { $ne: config.superID } },
            {
              $or: [
                { "fullName.firstName": searchReg },
                { "fullName.lastName": searchReg },
                { email: searchReg },
                { phone: searchReg },
              ],
            },
          ],
        },
        { password: 0 }
      )
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse });
      return res.json(users);
    } catch (err) {
      console.log(err);
      res.status(500).json({ err: err });
    }
  },
  uploadImg: async (req, res) => {
    let image = req.body;

    if (image) {
      try {
        let user = await UserModel.findOne({ _id: req.tokenData._id });
        user.profile_img = req.body;
        await user.save();
        res.status(200).json({ msg: "profile has been changed" });
      } catch (err) {
        res.status(500).json({ err });
      }
    } else {
      res.status(404).json({ err: "Must send an image" });
    }
  },
  uploadBanner: async (req, res) => {
    let banner = req.body;
    console.log(banner);
    if (banner) {
      try {
        let user = await UserModel.findOne({ _id: req.tokenData._id });
        user.cover_img = req.body;
        await user.save();
        res.status(200).json({ msg: "banner has been changed" });
      } catch (err) {
        res.status(500).json({ err });
      }
    } else {
      res.status(404).json({ err: "Must send an banner" });
    }
  },
  profileImgDelete: async (req, res) => {
    let id = req.query.id;
    let details = {
      cloud_name: config.cloudinary_profile_name,
      api_key: config.cloudinary_profile_key,
      api_secret: config.cloudinary_profile_secret,
      type: "upload",
    };
    cloudinary.uploader.destroy(id, details, (error, result) => {
      if (error) return res.json({ error });
      return res.json({ result });
    });
  },
  bannerImgDelete: async (req, res) => {
    let id = req.query.id;
    let details = {
      cloud_name: config.cloudinary_banner_name,
      api_key: config.cloudinary_banner_key,
      api_secret: config.cloudinary_banner_secret,
      type: "upload",
    };
    cloudinary.uploader.destroy(id, details, (error, result) => {
      if (error) return res.json({ error });
      return res.json({ result });
    });
  },
  getUserWishList: async (req, res) => {
    let user = await UserModel.findOne({ _id: req.tokenData._id }).populate({
      path: "wishList",
    });
    try {
      let wishList = user.wishList.sort(function (a, b) {
        var keyA = new Date(a.updatedAt),
          keyB = new Date(b.updatedAt);
        // Compare the 2 dates
        if (keyA > keyB) return -1;
        if (keyA < keyB) return 1;
        return 0;
      });
      return res.status(200).json(wishList);
    } catch (err) {
      console.log(err);
      res.status(500).json({ err: err });
    }
  },
};
