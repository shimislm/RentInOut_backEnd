const express = require("express");
const { auth, authAdmin } = require("../middlewares/auth");
const { postCtrl } = require("../controllers/postCtrl");
const router = express.Router();

router.get("/", postCtrl.getAll);
router.post("/", auth, postCtrl.upload);
router.put("/:postID", auth, postCtrl.update);
router.delete("/:postID", auth, postCtrl.delete);
router.get("/count", authAdmin, postCtrl.countAll);
router.get("/countMyPosts", auth, postCtrl.countMyPosts);
router.patch("/changeActive/:postID", authAdmin, postCtrl.changeActive);
router.get("/single/:postID", auth ,postCtrl.singleInfo);
router.patch("/changeRange/:postID", auth, postCtrl.changeRange);
router.get("/search", postCtrl.search);
router.get("/checkLikes/:postID",postCtrl.countLikes);
// not done/ not working yet
router.post("/likePost/:postID",auth,  postCtrl.likePost)
router.get("/topThreeLikes/:postID");

module.exports = router;

