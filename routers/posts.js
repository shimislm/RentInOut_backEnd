const express = require("express");
const { auth, authAdmin } = require("../middlewares/auth");
const { postCtrl } = require("../controllers/postCtrl");
const router = express.Router();
// MVC
router.get("/", postCtrl.getAll);
router.post("/", auth, postCtrl.upload);
router.put("/:postID", auth, postCtrl.update);
router.delete("/:postID", auth, postCtrl.delete);
// MVC done
router.get("/count", authAdmin, postCtrl.countAll);
router.get("/countMyPosts", auth, postCtrl.countMyPosts);
router.patch("/changeActive/:postID", authAdmin, postCtrl.changeActive);
router.get("/userPosts", auth ,postCtrl.userPosts);
router.patch("/changeRange/:postID", auth, postCtrl.changeRange);
router.get("/search", postCtrl.search);
router.get("/checkLikes/:postID",postCtrl.countLikes);
router.get("/topThreeLikes/:postID",postCtrl.topThreeLikes);
router.post("/likePost/:postID",auth,  postCtrl.likePost)

module.exports = router;

