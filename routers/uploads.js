const express= require("express");
const { uploadCtrl } = require("../controllers/uploadCtrl");
const router = express.Router();

router.get("/" , (req,res)=> {
  res.json({msg:"Upload work!!!!!"})
})

router.post("/", uploadCtrl.upload)

module.exports = router;
