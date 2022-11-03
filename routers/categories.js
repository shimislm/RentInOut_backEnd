const express= require("express");
const {auth , authAdmin} = require("../middlewares/auth");
const { categoryCtrl } = require("../controllers/categoryCtrl");
const router = express.Router();

router.get("/" , (req,res)=> {
    res.json({msg:"Categories work!!!!!"})
  })
router.get("/" , )

module.exports = router;

