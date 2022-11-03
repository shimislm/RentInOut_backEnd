
exports.uploadCtrl= {
    upload:async(req,res) => {
    let myFile = req.files["myFile22"];
  
    if(!myFile){
      res.status(400).json({msg:"You need to send file"});
    }
    if(myFile.size > 1024 * 1024 * 2){
      res.status(400).json({msg:"File too big (max 2mb)"});
    }
    myFile.mv("public/images/"+myFile.name,(err) => {
      if(err){
        console.log(err)
        res.status(400).json({msg:"There problem"});
      }
      res.json({msg:"File uploaded"})
    })
  }
}