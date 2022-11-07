const express= require("express");
const {auth , authAdmin} = require("../middlewares/auth");
const { productCtrl } = require("../controllers/productCtrl");
const router = express.Router();

router.get("/",);
router.put("/:postID",auth);
router.delete("/:postID",auth);
router.post("/",auth);
router.get("/count",authAdmin);
router.get("/countMyPosts",auth);
router.get("/search",);
router.patch("/changeActive/:postID",auth);
router.get("/single/:postID",auth);
router.patch("/changeRange/:postID",auth);
router.get("/checkLikes/:postID");
router.get("/topThreeLikes/:postID");

module.exports = router;

