const { PostModel } = require("../models/postModel");
const { validatePost } = require("../validations/postValid");

exports.postCtrl = {
    getAll : async(req,res) =>{
        let perPage = Math.min(req.query.perPage, 20) || 10;
        let page = req.query.page || 1;
        let sort = req.query.sort || "_id";
        let reverse = req.query.reverse == "yes" ? -1 : 1
        try {
            let posts = await PostModel
                .find({})
                .limit(perPage)
                .skip((page - 1) * perPage)
                .sort({[sort]:reverse})
            res.json(posts);
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ err: err });
        }
    },
    upload : async(req,res) =>{
        let validBody = validatePost(req.body);
        if (validBody.error) {
            return res.status(400).json(validBody.error.details)
        }
        try {
            let post = new PostModel(req.body);
            post.creator_id = req.tokenData._id;
            post.save();
            res.status(201).json(post);
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ err: err });
        }
    },
    update : async(req,res) =>{
        try {
            let postID = req.params.postID;
            let data;
            if (req.tokenData.role === "admin") {
                data = await PostModel.updateOne({ _id: postID },req.body);
            }
            else {
                data = await PostModel.updateOne({ _id: postID, creator_id: req.tokenData._id },req.body);
            }
            let post = await PostModel.findOne({_id:postID})
            post.updatedAt = new Date(Date.now() +2 * 60 * 60 * 1000)
            post.save()
            res.status(200).json({data,msg:"post edited"});
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ err })
        }
    },
    delete : async(req,res) =>{
        
    }
}