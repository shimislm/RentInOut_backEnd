const { config } = require("dotenv");
const { PostModel } = require("../models/postModel");
const { UserModel } = require("../models/userModel")
const { validatePost } = require("../validations/postValid");
const MAX = 10000000;
const MIN = 0;
exports.postCtrl = {
    getAll: async (req, res) => {
        let perPage = Math.min(req.query.perPage, 20) || 10;
        let page = req.query.page || 1;
        let sort = req.query.sort || "createdAt";
        let reverse = req.query.reverse == "yes" ? -1 : 1
        try {
            let posts = await PostModel
                .find({})
                .limit(perPage)
                .skip((page - 1) * perPage)
                .sort({ [sort]: reverse })
            res.json(posts);
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ err: err });
        }
    },
    upload: async (req, res) => {
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
    update: async (req, res) => {
        try {
            let postID = req.params.postID;
            let data;
            if (req.tokenData.role === "admin") {
                data = await PostModel.updateOne({ _id: postID }, req.body);
            }
            else {
                data = await PostModel.updateOne({ _id: postID, creator_id: req.tokenData._id }, req.body);
            }
            if (data.modifiedCount === 1) {
                let post = await PostModel.findOne({ _id: postID })
                post.updatedAt = new Date(Date.now() + 2 * 60 * 60 * 1000)
                await post.save()
                return res.status(200).json({ data, msg: "post edited" });
            }
            res.status(400).json({ data: null, msg: "cannot edit post" });
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ err })
        }
    },
    delete: async (req, res) => {
        try {
            let postID = req.params.postID;
            let data;
            if (req.tokenData.role === "admin") {
                data = await PostModel.deleteOne({ _id: postID }, req.body);
            }
            else {
                data = await PostModel.deleteOne({ _id: postID, creator_id: req.tokenData._id }, req.body);
            }
            if (data.deletedCount === 1) {
                return res.status(200).json({ data, msg: "post deleted" });
            }
            res.status(400).json({ data: null, msg: "user cannot delete this post" });
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ err })
        }
    },
    countAll: async (req, res) => {
        try {
            let count = await PostModel.countDocuments({});
            res.json({ count });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "err", err });
        }
    },
    countMyPosts: async (req, res) => {
        try {
            let count = await PostModel.countDocuments({ creator_id: req.tokenData._id });
            res.json({ count });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "err", err });
        }
    },
    search: async (req, res) => {
        let perPage = Math.min(req.query.perPage, 20) || 10;
        let page = req.query.page || 1;
        try {
            let searchQ = req.query?.s;
            let max = req.query.max || MAX;
            let min = req.query.min || MIN;
            let searchReg = new RegExp(searchQ, "i");
            // http://localhost:3000/posts/search?s=board&min=10&max=21
            let books = await PostModel.find({
                $and: [{ $or: [{ title: searchReg }, { info: searchReg }] },
                { $and: [{ price: { $gte: min } }, { price: { $lte: max } }] }]
            })
                .limit(perPage)
                .skip((page - 1) * perPage)
            res.json(books);
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ err: err });
        }
    },
    changeActive: async (req, res) => {
        if (!req.body.active && req.body.active != false) {
            return res.status(400).json({ msg: "Need to send active in body" });
        }
        try {
            let postID = req.params.postID;
            if (postID == config.superID) {
                return res.status(401).json({ msg: "You cant change superadmin to user" });
            }
            let data = await PostModel.updateOne({ _id: postID }, { active: req.body.active });

            //update the change time 
            let post = await PostModel.findOne({ _id: postID })
            post.updatedAt = new Date(Date.now() + 2 * 60 * 60 * 1000)
            post.save()

            return res.json(data);
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "err", err });
        }
    },
    userPosts: async (req, res) => {
        let perPage = Math.min(req.query.perPage, 20) || 10;
        let page = req.query.page || 1;
        let sort = req.query.sort || "createdAt";
        let reverse = req.query.reverse == "yes" ? -1 : 1
        try {
            let posts = await PostModel
                .find({ creator_id: req.tokenData._id })
                .limit(perPage)
                .skip((page - 1) * perPage)
                .sort({ [sort]: reverse })
            res.json(posts);
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ err: err });
        }
    },
    changeRange: async (req, res) => {
        if (!req.body.range && req.body.range != false) {
            return res.status(400).json({ msg: "Need to send range in body" });
        }
        if (req.body.range != "long-term" && req.body.range != "short-term") {
            console.log(typeof req.body.range)
            return res.status(400).json({ msg: "Range must be long/short-term" });
        }
        try {
            let postID = req.params.postID;
            let data;
            if (postID == config.superID) {
                return res.status(401).json({ msg: "You cant change superadmin to user" });
            }
            if (req.tokenData.role === "admin") {
                data = await PostModel.updateOne({ _id: postID }, { range: req.body.range });
            }
            else {
                data = await PostModel.updateOne({ _id: postID, creator_id: req.tokenData._id }, { range: req.body.range });
            }
            //update the change time 
            let post = await PostModel.findOne({ _id: postID })
            post.updatedAt = new Date(Date.now() + 2 * 60 * 60 * 1000)
            post.save()
            return res.json(data);
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "err", err });
        }
    },
    likePost: async (req, res) => {
        try {
            let { fullName } = await UserModel.findOne({ _id: req.tokenData._id });
            //creating an object from the user 
            let user = {
                user_id: req.tokenData._id,
                profile: "https://cdn-icons-png.flaticon.com/128/1077/1077114.png",
                fullName
            }
            let postID = req.params.postID;
            let post = await PostModel.findOne({ _id: postID });
            //need to check if the user already 
            // if the user found in the array setup found true else false
            const found = post.likes.some(el => el.user_id === req.tokenData._id);
            if (!found) {
                post.likes.push(user);
                await post.save()
                return res.status(201).json({ posts: post.likes, msg: "You like the post" })
            }
            // remove from post like the user.
            post.likes = post.likes.filter((e) => e.user_id != req.tokenData._id)
            await post.save()
            res.status(201).json({ posts: post.likes, msg: "unlike the post" })
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "err", err });
        }
    },
    countLikes: async (req, res) => {
        try {
            let postID = req.params.postID;
            let post = await PostModel.findOne({ _id: postID });
            let likes = await post.likes;
            res.json({ count: likes.length });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "err", err });
        }
    },
    topThreeLikes: async (req, res) => {
        try {
            let postID = req.params.postID;
            let post = await PostModel.findOne({ _id: postID })
            res.json({ likes: post.likes.splice(0, 3) })
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "err", err });
        }
    }
}