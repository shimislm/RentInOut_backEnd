const express = require("express");
const {auth, authAdmin} = require("../middlewares/auth")
const router = express.Router();
const { userCtrl } = require("../controllers/userCtrl");
const { authCtrl } = require("../controllers/authCtrl");

// authonication routes
router.post('/', authCtrl.signUp)

router.post('/login', authCtrl.login)

// user routes

router.get("/userList", authAdmin , userCtrl.getUsersList)

// router.get("/categoryList",authAdmin , userCtrl.getCategoriesList)

router.get("/countUsers",authAdmin , userCtrl.countUsers)

router.get('/info/:id', auth , userCtrl.infoById)

router.post("/:idEdit", auth , userCtrl.edit)

router.delete("/:idDel", auth , userCtrl.delete)

router.patch("/changeRole/:userID",authAdmin, userCtrl.changeRole)

router.patch("/changeActive/:userID",authAdmin , userCtrl.changeActive)



module.exports = router;