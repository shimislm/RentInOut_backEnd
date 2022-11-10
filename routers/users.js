const express = require("express");
const { auth, authAdmin, isLoggedIn } = require("../middlewares/auth")
const router = express.Router();
const { userCtrl } = require("../controllers/userCtrl");
const { authCtrl } = require("../controllers/authCtrl");
const passport = require("passport");

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