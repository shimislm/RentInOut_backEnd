const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/userModel");
const { config } = require("../config/config");
const { validateUser } = require("../validations/userValid");
const router = express.Router();

exports.userCtrl = {
  checkToken: async (req, res) => {
    res.json(req.tokenData);
  },
  info: async (req, res) => {
    try {
      let userInfo = await UserModel.findOne(
        { _id: req.tokenData._id },
        { password: 0 }
      );
      res.json(userInfo);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  getList: async (req, res) => {
    try {
      let data = await UserModel.find({}, { password: 0 }).limit(20);
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  count: async (req, res) => {
    try {
      let count = await UserModel.countDocuments({});
      res.json({ count });
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  changeRole: async (req, res) => {
    if (!req.body.role) {
      return res.status(400).json({ msg: "Need to send role in body" });
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
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
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
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  delete: async (req, res) => {
    let userValid = validateUser(req.body);
    if (!userValid) {
      return res.status(400).json({ msg: "Need to send valid body" });
    }
    try {
      let userID = req.params.idDel;
      const user = await UserModel.findOne({ _id: userID });
      let data;

      if (userID == config.superID) {
        return res.status(401).json({ msg: "You cant delete superadmin" });
      }
      if (user.role === "admin") {
        data = await UserModel.deleteOne({ _id: userID });
      } else {
        data = await UserModel.deleteOne({
          _id: userID,
          userID: req.tokenData._id,
        });
      }
      res.json(data);
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
      const user = await UserModel.findOne({ _id: userID });
      let userID = req.params.idEdit;
      if (userID == config.superID) {
        return res.status(401).json({ msg: "You cant update Superadmin" });
      }
      if (user.role === "admin") {
        data = await UserModel.updateOne({ _id: userID });
      } else {
        data = await UserModel.updateOne({
          _id: userID,
          userID: req.tokenData._id,
        }, req.body);

      res.json(data);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },
};
