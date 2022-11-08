const express = require("express");
const {auth, authAdmin} = require("../middlewares/auth")
const router = express.Router();
const { userCtrl } = require("../controllers/userCtrl");
const { authCtrl } = require("../controllers/authCtrl");

// authonication routes
router.post('/', authCtrl.signUp)

router.get("/verified/:userId/:uniqueString" , authCtrl.verifyUser)

router.post('/login', authCtrl.login)

// user routes

router.get("/userList", authAdmin , userCtrl.getUsersList)

router.get("/countUsers",authAdmin , userCtrl.countUsers)

router.get('/info/:id', auth , userCtrl.infoById)

router.put("/:idEdit", auth , userCtrl.edit)

router.delete("/:idDel", auth , userCtrl.delete)

router.patch("/changeRole/:userID",authAdmin, userCtrl.changeRole)

router.patch("/changeActive/:userID",authAdmin , userCtrl.changeActive)



module.exports = router;