const express= require("express");
const {auth , authAdmin} = require("../middlewares/auth");
const { postCtrl } = require("../controllers/postCtrl");
const router = express.Router();

router.get("/", postCtrl.getAll);
router.post("/", auth , postCtrl.upload);
router.put("/:postID", auth ,postCtrl.update);

router.delete("/:postID", auth);
router.get("/count", authAdmin);
router.get("/countMyPosts", auth);
router.get("/search",);
router.patch("/changeActive/:postID",auth);
router.get("/single/:postID",auth);
router.patch("/changeRange/:postID",auth);
router.get("/checkLikes/:postID");
router.get("/topThreeLikes/:postID");

module.exports = router;

