const express = require("express");
const {auth, authAdmin} = require("../middlewares/auth")
const router = express.Router();
const { userCtrl } = require("../controllers/userCtrl");
const { authCtrl } = require("../controllers/authCtrl");

router.get("/" , (req,res)=> {
    res.json({msg:"Users work!!!!!"})
  })
// authonication routes
router.post('/login', authCtrl.login)

router.post('/', authCtrl.signUp)

// user routes

router.get("/userList",authAdmin , userCtrl.getList)

router.get("/count",authAdmin , userCtrl.countUsers)

router.get('/info', auth , userCtrl.info)

router.post("/:idEdit", auth , userCtrl.edit)

router.delete("/:idDel", auth , userCtrl.delete)

router.patch("/changeRole/:userID",authAdmin, userCtrl.changeRole)

router.patch("/changeActive/:userID",authAdmin , userCtrl.changeActive)



module.exports = router;