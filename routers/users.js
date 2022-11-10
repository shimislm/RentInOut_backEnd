const express = require("express");
const { auth, authAdmin, isLoggedIn } = require("../middlewares/auth")
const router = express.Router();
const { userCtrl } = require("../controllers/userCtrl");
const { authCtrl } = require("../controllers/authCtrl");
const passport = require("passport");


//google signIn
router.get('/auth/google',passport.authenticate('google', {
    scope: ['email', 'profile']
}))
router.get('/welcome', function (req, res) {
    if (req.session.loggedin) {
        res.redirect("../test.html")
    } else {
        res.json({err : "access denied"});
        res.end();
    }
});
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: "/",
}),(req,res) =>{
    req.session.userData = {
        profile: req.user.photos[0].value,
        email: req.user.email,
        user : req.user
    };
    req.session.loggedin = true;
    req.googleUser = req.user.email;
    res.redirect("/users/welcome");
    res.end();
});
router.get('/getData', function (req, response) {
    if (req.session.loggedin) {
        var data = JSON.stringify(req.session.userData);
        response.write(data);
        response.end();
    } else {
        response.write("access denied");
        response.end();
    }
});
router.get('/logout', function (req, response) {
    if (req.session.loggedin) {
        req.session.destroy();
        response.redirect("/");
        response.end()
    } else {
        response.redirect("/");
        response.end()
    }
});
// authonication routes
router.post('/', authCtrl.signUp)
router.get("/verified" , authCtrl.verifiedUser)
router.get("/verify/:userId/:uniqueString", authCtrl.verifyUser)
router.post('/login', authCtrl.login)
router.post("/requestPasswordReset", authCtrl.requestPasswordReset)
router.post("/resetPassword" , authCtrl.resetPassword)
// user routes
router.get("/userList", authAdmin, userCtrl.getUsersList)
router.get("/countUsers", authAdmin, userCtrl.countUsers)
router.get('/info/:id', auth, userCtrl.infoById)
router.put("/:idEdit", auth, userCtrl.edit)
router.delete("/:idDel", auth, userCtrl.delete)
router.patch("/changeRole/:userID", authAdmin, userCtrl.changeRole)
router.patch("/changeActive/:userID", authAdmin, userCtrl.changeActive)



module.exports = router;