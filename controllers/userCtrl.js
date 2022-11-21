
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/userModel");
const { config } = require("../config/config");
const { validateUser } = require("../validations/userValid");


exports.userCtrl = {
  checkToken: async (req, res) => {
    res.json(req.tokenData);
  },
  infoById: async (req, res) => {
    try {
      let id = req.params.id;
      let userInfo;
      if (id == config.superID) {
        return res
          .status(401)
          .json({ msg: "You cant change superadmin to user" });
      }
      if (req.tokenData.role == "admin") {
        userInfo = await UserModel.findOne({ _id: id }, { password: 0 });
      }
      else if (req.tokenData._id === id) {
        userInfo = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 });
      }
      else {
        return res
          .status(401).json({ msg: "Not allowed" })
      }
      return res.json({ userInfo });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "err", err });
    }
  },
  getUsersList: async (req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 5;
    let page = req.query.page || 1;
    let sort = req.query.sort || "role";
    let reverse = req.query.reverse == "yes" ? -1 : 1;
    try {
      let data = await UserModel
        .find({}, { password: 0 })
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
      let user = await UserModel.findOne({ _id: userID })
      user.role = user.role == "admin" ? "user" : "admin";
      user.updatedAt = new Date(Date.now() + 2 * 60 * 60 * 1000)
      user.save()
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
      let user = await UserModel.findOne({ _id: userID })
      user.active = !user.active;
      user.updatedAt = new Date(Date.now() + 2 * 60 * 60 * 1000)
      user.save()
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
      }
      else if (req.tokenData._id === idDel) {
        userInfo = await UserModel.deleteOne({ _id: req.tokenData._id }, { password: 0 });
      }
      else {
        return res
          .status(401).json({ msg: "Not allowed" })
      }
      res.json(userInfo);
    }
    catch (err) {
      console.log(err)
      res.status(500).json({ msg: "err", err })
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
        return res.status(401).json({ msg: "email/pasword change is not allowed" })
      }
      if (req.tokenData.role === "admin") {
        user = await UserModel.updateOne({ _id: idEdit }, req.body);
      }
      else if(idEdit === req.tokenData._id) {
        user = await UserModel.updateOne({ _id: idEdit, _id: req.tokenData._id }, req.body);
      }
      user = await UserModel.findOne({ _id: idEdit })
      user.updatedAt = new Date(Date.now() + 2 * 60 * 60 * 1000)
      user.save()
      return res.status(200).json({ msg: user })
    }
    catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "err", err });
    }
  }
  ,
  rankUser: async (req, res) => {
    let rankedUserId = req.params.userID
    const rnk = req.body.rnk
    console.log(rnk)
    if (rnk > 5) {
      return res.status(401).json({ msg: "Cant rank more than 5" })
    }
    try {
      let user = await UserModel.findOne({ $and: [{ _id: rankedUserId }, { _id: { $ne: req.tokenData._id } }] })
      let found
      // if(user.rank.length >0 ){
      found = user.rank.some(el => el.user_id === req.tokenData._id);
      // }
      if (!found) {
        user.rank.push({ user_id: req.tokenData._id, rank: rnk });
        await user.save()
        res.status(201).json({ msg: "rank succeed" })
      }
      else {
        return res.status(401).json({ msg: "Cant rank more than once" })
      }
    }
    catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Not possible to rank at this time", err });
    }
  },
  avgRank: async (req, res) => {
    let rankedUserId = req.params.userID
    try {
      let { rank } = await UserModel.findOne({ _id: rankedUserId })
      let ranks = rank.map(el => el.rank)
      const average = ranks.reduce((a, b) => a + b, 0) / ranks.length;
      res.status(200).json({ average })
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Error occured rty again later", err });
    }
  }
};
