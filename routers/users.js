const express = require("express");
const { auth, authAdmin, isLoggedIn } = require("../middlewares/auth")
const router = express.Router();
const { userCtrl } = require("../controllers/userCtrl");
const { authCtrl } = require("../controllers/authCtrl");
const passport = require("passport");
const { UserModel } = require("../models/userModel");
const axios = require("axios")


//google signIn

router.get('/auth/google', passport.authenticate('google', {
    scope: ['email', 'profile']
}))
router.get('/welcome', authCtrl.loginRegisterGmail);
router.get('/google/callback', passport.authenticate('google', { failureRedirect: "/", }), authCtrl.callbackGmail);
router.get('/logoutGmail', authCtrl.logoutGmail);

// authonication routes

router.post('/', authCtrl.signUp)
router.get("/verified", authCtrl.verifiedUser)
router.get("/verify/:userId/:uniqueString", authCtrl.verifyUser)
router.post('/login', authCtrl.login)
router.post("/requestPasswordReset", authCtrl.requestPasswordReset)
router.post("/resetPassword", authCtrl.resetPassword)

// user routes

router.get("/userList", authAdmin, userCtrl.getUsersList)
router.get("/countUsers", authAdmin, userCtrl.countUsers)
router.get('/info/:id', auth, userCtrl.infoById)
router.get('/getRank/:userID', userCtrl.avgRank)
router.put("/:idEdit", auth, userCtrl.edit)
router.delete("/:idDel", auth, userCtrl.delete)
router.patch("/changeRole/:userID", authAdmin, userCtrl.changeRole)
router.patch("/changeActive/:userID", authAdmin, userCtrl.changeActive)
router.patch("/rankUser/:userID", auth, userCtrl.rankUser)



module.exports = router;