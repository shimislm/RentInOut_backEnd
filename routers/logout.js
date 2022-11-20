const router = require("express").Router();
const logoutCtr = require("../controllers/logoutCtrl");

router.get("/", logoutCtr);

module.exports = router;
