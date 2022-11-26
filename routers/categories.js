const express = require("express");
const { authAdmin } = require("../middlewares/auth");
const { categoryCtrl } = require("../controllers/categoryCtrl");
const router = express.Router();

router.get("/", authAdmin, categoryCtrl.getCategorylist)
router.post("/", authAdmin, categoryCtrl.addCategory)
router.put("/:idEdit", authAdmin, categoryCtrl.editCategory)
router.delete("/:idDel", authAdmin, categoryCtrl.deleteCategory)
router.get("/count", authAdmin, categoryCtrl.countCategory)

module.exports = router;

