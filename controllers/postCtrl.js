
const { config } = require("../config/config");
const { select } = require("../helpers/userHelper");
const { PostModel } = require("../models/postModel");
const { UserModel } = require("../models/userModel");
const { validatePost } = require("../validations/postValid");
const cloudinary = require("cloudinary").v2;
const MAX = 10000000;
const MIN = 0;
exports.postCtrl = {
  getAll: async (req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 10;
    let page = req.query.page || 1;
    let sort = req.query.sort || "createdAt";
    let reverse = req.query.reverse == "yes" ? -1 : 1;
    try {
      let posts = await PostModel.find({})
        .sort({ [sort]: reverse })
        .limit(perPage)
        .skip((page - 1) * perPage)
        .populate({ path: "creator_id", select });
      return res.json(posts);
    } catch (err) {
      res.status(500).json({ err: err });
    }
  },
  postByID: async (req, res) => {
    let postID = req.params.postID;
    try {
      const post = await PostModel.findById(postID).populate({
        path: "creator_id",
        select,
      });
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json({ err: "cannot find the post.." });
    }
  },
  upload: async (req, res) => {
    let validBody = validatePost(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      let newPost = new PostModel(req.body);
      newPost.creator_id = req.tokenData._id;
      await newPost.save();
      post = await PostModel.findById(newPost._id).populate({path: "creator_id", select})
      res.status(201).json(post);
    } catch (err) {
      res.status(500).json({ err: err });
    }
  },
  update: async (req, res) => {
    try {
      let postID = req.params.postID;
      let data;
      if (req.tokenData.role === "admin") {
        data = await PostModel.updateOne({ _id: postID }, req.body);
      } else {
        data = await PostModel.updateOne(
          { _id: postID, creator_id: req.tokenData._id },
          req.body
        );
      }
      if (data.modifiedCount === 1) {
        let post = await PostModel.findOne({ _id: postID });
        post.updatedAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
        await post.save();
        return res.status(200).json({ data, msg: "post edited" });
      }
      res.status(400).json({ data: null, msg: "cannot edit post" });
    } catch (err) {
      console.log(err);
      res.status(400).json({ err });
    }
  },
  delete: async (req, res) => {
    let postID = req.params.postID;
    let details = {
      cloud_name: config.cloudinary_post_name,
      api_key: config.cloudinary_post_key,
      api_secret: config.cloudinary_post_secret,
      type: "upload",
    };
    let post = await PostModel.findById(postID);
    post.img.forEach((img) => {
      cloudinary.uploader.destroy(img.img_id, details, (error, result) => {
        if (error) return res.json({ error });
      });
    });
    try {
      let data;
      if (req.tokenData.role === "admin") {
        data = await PostModel.deleteOne({ _id: postID }, req.body);
      } else {
        data = await PostModel.deleteOne(
          { _id: postID, creator_id: req.tokenData._id },
          req.body
        );
      }
      if (data.deletedCount === 1) {
        return res.status(200).json({ data, msg: "post deleted" });
      }
      res.status(400).json({ data: null, msg: "user cannot delete this post" });
    } catch (err) {
      console.log(err);
      res.status(400).json({ err });
    }
  },
  countAll: async (req, res) => {
    try {
      let count = await PostModel.countDocuments({});
      res.json({ count });
    } catch (err) {
      res.status(500).json({ msg: "err", err });
    }
  },
  countMyPosts: async (req, res) => {
    try {
      let count = await PostModel.countDocuments({
        creator_id: req.tokenData._id,
      });
      res.json({ count });
    } catch (err) {
      res.status(500).json({ msg: "err", err });
    }
  },
  search: async (req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 10;
    let page = req.query.page || 1;
    let sort = req.query.sort || "createdAt";
    let reverse = req.query.reverse == "yes" ? -1 : 1;
    try {
      let searchQ = req.query?.s;
      let max = req.query.max || MAX;
      let min = req.query.min || MIN;
      let searchReg = new RegExp(searchQ, "i");
      let posts = await PostModel.find({
        $and: [
          { $or: [{ title: searchReg }, { info: searchReg }] },
          { $and: [{ price: { $gte: min } }, { price: { $lte: max } }] },
        ],
      })
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse })
        .populate({ path: "creator_id", select });
      res.json(posts);
    } catch (err) {
      res.status(500).json({ err: err });
    }
  },
  changeActive: async (req, res) => {
    try {
      let postID = req.params.postID;
      if (postID == config.superID) {
        return res
          .status(401)
          .json({ msg: "You cant change superadmin to user" });
      }
      let post = await PostModel.findOne({ _id: postID });
      post.active = !post.active;
      post.updatedAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
      post.save();

      return res.json(post);
    } catch (err) {
      res.status(500).json({ msg: "err", err });
    }
  },
  userPosts: async (req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 10;
    let page = req.query.page || 1;
    let sort = req.query.sort || "createdAt";
    let reverse = req.query.reverse == "yes" ? -1 : 1;
    try {
      let id = req.params.userID;
      console.log(id);
      let posts = await PostModel.find({ creator_id: id })
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse })
        .populate({ path: "creator_id", select });
      res.json(posts);
    } catch (err) {
      res.status(500).json({ err: err });
    }
  },
  changeRange: async (req, res) => {
    if (!req.body.range && req.body.range != false) {
      return res.status(400).json({ msg: "Need to send range in body" });
    }
    if (req.body.range != "long-term" && req.body.range != "short-term") {
      console.log(typeof req.body.range);
      return res.status(400).json({ msg: "Range must be long/short-term" });
    }
    try {
      let postID = req.params.postID;
      let data;
      if (postID == config.superID) {
        return res
          .status(401)
          .json({ msg: "You cant change superadmin to user" });
      }
      if (req.tokenData.role === "admin") {
        data = await PostModel.updateOne(
          { _id: postID },
          { range: req.body.range }
        );
      } else {
        data = await PostModel.updateOne(
          { _id: postID, creator_id: req.tokenData._id },
          { range: req.body.range }
        );
      }
      //update the change time
      let post = await PostModel.findOne({ _id: postID });
      post.updatedAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
      post.save();
      return res.json(data);
    } catch (err) {
      res.status(500).json({ msg: "err", err });
    }
  },
  likePost: async (req, res) => {
    try {
      let user = await UserModel.findOne({ _id: req.tokenData._id });
      //creating an object from the user
      let userInfo = {
        user_id: user._id,
        profile_img: user.profile_img.url,
        fullName: user.fullName,
      };
      let postID = req.params.postID;
      let post = await PostModel.findOne({ _id: postID });
      //need to check if the user already
      // if the user found in the array setup found true else false
      const found = post.likes.some((el) => el.user_id === req.tokenData._id);
      if (!found) {
        post.likes.unshift(userInfo);
        await post.save();
        // add to wish list
        const inWishlist = user.wishList.some(
          (el) => String(el._id) === postID
        );
        if (!inWishlist && String(post.creator_id) != req.tokenData._id) {
          user.wishList.unshift(post._id);
          await user.save();
        }
        return res
          .status(201)
          .json({ posts: post.likes, msg: "You like the post" });
      }
      // remove from post like the user.
      post.likes = post.likes.filter((e) => e.user_id != req.tokenData._id);
      await post.save();
      // wish list remove item
      user.wishList = user.wishList.filter((el) => String(el._id) !== postID);
      await user.save();
      res.status(201).json({ posts: post.likes, msg: "unlike the post" });
    } catch (err) {
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
      res.status(500).json({ msg: "err", err });
    }
  },
  topThreeLikes: async (req, res) => {
    try {
      let postID = req.params.postID;
      let post = await PostModel.findOne({ _id: postID });
      res.json({ likes: post.likes.splice(0, 3) });
    } catch (err) {
      res.status(500).json({ msg: "err", err });
    }
  },
  onCancelDel: async (req, res) => {
    let images = req.body;
    let details = {
      cloud_name: config.cloudinary_post_name,
      api_key: config.cloudinary_post_key,
      api_secret: config.cloudinary_post_secret,
      type: "upload",
    };
    try {
      images.forEach((img) => {
        cloudinary.uploader.destroy(img.img_id, details, (error, result) => {
          if (error) return res.json({ error });
        });
      });
      return res.json({ msg: "delete all images succeed" });
    } catch (err) {
      res.status(500).json({ msg: "err", err });
    }
  },
  singlePostImgDelete: async (req, res) => {
    let { postID, imgID } = req.params;
    let details = {
      cloud_name: config.cloudinary_post_name,
      api_key: config.cloudinary_post_key,
      api_secret: config.cloudinary_post_secret,
      type: "upload",
    };
    let post = await PostModel.findById(postID);
    post.img.filter((img) => {
      img.img_id !== imgID;
    });
    await post.save();
    cloudinary.uploader.destroy(imgID, details, (error, result) => {
      if (error) return res.json({ error });
    });
    return res.json({ msg: "delete all images succeed" });
  },
};
