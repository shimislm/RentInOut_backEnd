const express= require("express");
const {auth , authAdmin} = require("../middlewares/auth");
const { categoryCtrl } = require("../controllers/categoryCtrl");
const { authCtrl } = require("../controllers/authCtrl");
const router = express.Router();



  router.get("/",authAdmin , categoryCtrl.getlist)

router.post("/",authAdmin , categoryCtrl.addcat)

router.put("/:idEdit", authAdmin , categoryCtrl.editcat)

router.delete("/:idDel", authAdmin , categoryCtrl.delete)

router.get("/count",authAdmin , categoryCtrl.countCat)

module.exports = router;

