const express = require("express");
const { auth, authAdmin } = require("../middlewares/auth");
const router = express.Router();
const { userCtrl } = require("../controllers/userCtrl");
const { authCtrl } = require("../controllers/authCtrl");
const { mailMe } = require("../controllers/sendEmail");
const { socketCtrl } = require("../controllers/socketCtrl");

//google signIn
router.post("/login/gmail", authCtrl.loginGmail);

// authonication routes
router.post("/", authCtrl.signUp);
router.get("/verified", authCtrl.verifiedUser);
router.get("/verify/:userId/:uniqueString", authCtrl.verifyUser);
router.post("/login", authCtrl.login);
router.post("/requestPasswordReset", authCtrl.requestPasswordReset);
router.post("/resetPassword", authCtrl.resetPassword);
router.post("/clientEmail", mailMe.sendEmail);

// user routes

router.get("/userList", authAdmin, userCtrl.getUsersList);
router.get("/userSearch", userCtrl.userSearch);
router.get("/countUsers", authAdmin, userCtrl.countUsers);
router.get("/info/:id", userCtrl.infoById);
router.get("/infoToken/:id", auth, userCtrl.infoByIdWithToken);
router.get("/getRank/:userID", userCtrl.avgRank);
router.get("/getChat/:roomID", auth, socketCtrl.getChatByRoomID);
router.get("/getAllChat", auth, socketCtrl.getUserChats);
router.get("/getWishList", auth, userCtrl.getUserWishList);
router.put("/:idEdit", auth, userCtrl.edit);
router.delete("/:idDel", auth, userCtrl.delete);
router.delete("/deleteChat/:chatID", auth, socketCtrl.deleteChat);
router.patch("/changeRole/:userID", authAdmin, userCtrl.changeRole);
router.patch("/changeActive/:userID", authAdmin, userCtrl.changeActive);
router.patch("/rankUser/:userID", auth, userCtrl.rankUser);
router.patch("/uploadProfile", auth, userCtrl.uploadImg);
router.patch("/uploadBanner", auth, userCtrl.uploadBanner);
router.patch("/chatUpdate", auth, socketCtrl.chatUpdate);
router.delete("/deleteMessage/:roomID/:msgID", auth, socketCtrl.deleteMessage);
// delete from cloudinary
router.post("/cloudinary/profileDel", userCtrl.profileImgDelete);
router.post("/cloudinary/bannerDel", auth, userCtrl.bannerImgDelete);

module.exports = router;
