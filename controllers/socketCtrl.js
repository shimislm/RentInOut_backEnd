const { MessageModel } = require("../models/messageModel")
const { UserModel } = require("../models/userModel")

exports.socketCtrl = {
    saveNewChat: async (req, res) => {
        let owner = await UserModel.findById(req.body.owner.owner_id)
        if(!owner) {
            return res.status(401).json({msg: "Post owner not exist"})
        }
        let user = await UserModel.findById(req.body.owner.user_id)
        if(!user) {
            return res.status(401).json({msg: "User not exist"})
        }
        try {
            let message = new MessageModel(req.body)
            owner.messages.push(message._id)
            user.messages.push(message._id)
            res.status(201).json(message);
        }
        catch (err){
            res.status(500).json({ err: err });
        }
    },
    saveToExists : async (req,res) => {
        let chat = await MessageModel.findOne({roomID: req.body.roomID})

    }
}