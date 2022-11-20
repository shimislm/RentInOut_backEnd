const router = require("express").Router();
const refreshCtr = require("../controllers/refreshTokenCtrl");

router.get("/", refreshCtr);

module.exports = router;
