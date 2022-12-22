const { MessageModel } = require("../models/messageModel");
const { UserModel } = require("../models/userModel");

exports.socketCtrl = {
  chatUpdate: async (req, res) => {
    let message = await UserModel.findOne({ _id: req.body.userID }).populate({
      path: "messages",
      select: "roomID",
    });
    try {
      if (
        !message.messages.some((el) => el.roomID === req.body.messageObj.roomID)
      ) {
        let newMessage = new MessageModel(req.body.messageObj);
        newMessage.save();
        let user = await UserModel.updateOne(
          { _id: req.body.userID },
          { $push: { messages: newMessage._id } }
        );
        let creator = await UserModel.updateOne(
          { _id: req.body.creatorID },
          { $push: { messages: newMessage._id } }
        );
        return res.status(200).json({user, creator});
      } else {
        // console.log(req.body.messageObj.messages)
        let message = await MessageModel.findOneAndUpdate(
          { roomID: req.body.messageObj.roomID },
          { messagesArr: req.body.messageObj.messagesArr }
        );
        console.log(req.body.messageObj.messagesArr)
        message.save();
      }
      return res.status(200).json(message);
    } catch (err) {
      console.log(err);
      res.status(500).json({ err: err });
    }
  },
  getChatByRoomID: async (req, res) => {
    let message = await UserModel.findOne({ _id: req.tokenData._id }).populate({
      path: "messages",
    });
    let roomID = req.params.roomID;
    if (roomID) {
      try {
        let messages = message.messages.filter((msg) => msg.roomID === roomID);
        return res.status(200).json(messages);
      } catch (err) {
        console.log(err);
        res.status(500).json({ err: err });
      }
    } else return res.status(404).json({ msg: "Chat not found" });
  },
  getUserChats: async (req, res) => {
    let message = await UserModel.findOne({ _id: req.tokenData._id }).populate({
      path: "messages",
    });
    try {
      let messages = message.messages;
      return res.status(200).json(messages);
    } catch (err) {
      console.log(err);
      res.status(500).json({ err: err });
    }
  },
};
