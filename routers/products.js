const express= require("express");
const {auth , authAdmin} = require("../middlewares/auth");
const { productCtrl } = require("../controllers/productCtrl");
const router = express.Router();

router.get("/" , (req,res)=> {
    res.json({msg:"Products work!!!!!"})
  })
router.get("/" , )

module.exports = router;

