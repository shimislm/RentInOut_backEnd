const express = require("express");
const { authAdmin } = require("../middlewares/auth");
const { categoryCtrl } = require("../controllers/categoryCtrl");
const router = express.Router();

router.get("/", authAdmin, categoryCtrl.getlist)
router.post("/", authAdmin, categoryCtrl.addcat)
router.put("/:idEdit", authAdmin, categoryCtrl.editcat)
router.delete("/:idDel", authAdmin, categoryCtrl.delete)
router.get("/count", authAdmin, categoryCtrl.countCat)

module.exports = router;

