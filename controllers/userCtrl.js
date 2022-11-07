
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
         .status(401).json({ msg: "Not allowed"})
      }
      return res.json({userInfo});
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "err", err });
    }
    },
  getUsersList: async (req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 10;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id";
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
  countCategories: async (req, res) => {
    try {
      let count = await CategoryModel.countDocuments({});
      res.json({ count });
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  changeRole: async (req, res) => {
    if (!req.body.role) {
      return res.status(400).json({ msg: "Need to send role in body with json format" });
    }

    try {
      let userID = req.params.userID;

      if (userID == config.superID) {
        return res
          .status(401)
          .json({ msg: "You cant change Superadmin to user" });
      }
      let data = await UserModel.updateOne(
        { _id: userID },
        { role: req.body.role }
      );
      let user = await UserModel.findOne({_id:userID})
      user.updatedAt = new Date(Date.now() +2 * 60 * 60 * 1000)
      user.save()
      return res.json(data);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "err", err });
    }
  },

  changeActive: async (req, res) => {
    if (!req.body.active && req.body.active != false) {
      return res.status(400).json({ msg: "Need to send active in body" });
    }

    try {
      let userID = req.params.userID;
      if (userID == config.superID) {
        return res
          .status(401)
          .json({ msg: "You cant change superadmin to user" });
      }
      let data = await UserModel.updateOne(
        { _id: userID },
        { active: req.body.active }
      );
      let user = await UserModel.findOne({_id:userID})
      user.updatedAt = new Date(Date.now() +2 * 60 * 60 * 1000)
      user.save()
      return res.json(data);
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
         .status(401).json({ msg: "Not allowed"})
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
      if(req.body.email || req.body.password){
        return res.status(401).json({msg: "email/pasword change is not allowed"})
      }
      if (req.tokenData.role === "admin") {
          user = await UserModel.updateOne({ _id: idEdit },req.body );
      }
      else {
        user = await UserModel.updateOne({ _id: idEdit,_id: req.tokenData._id },req.body);
      }
      user = await UserModel.findOne({_id:idEdit})
      user.updatedAt = new Date(Date.now() +2 * 60 * 60 * 1000)
      user.save()
      return res.status(200).json({ msg: user })
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "err", err });
  }
  },
};
