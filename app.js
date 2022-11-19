const express = require("express");
require("./helpers/passport")
const path = require("path");
const http = require("http");
const cookieParser = require("cookie-parser")
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const { routesInit } = require("./routers/config_routes")
require("dotenv").config()
require("./db/mongoconnect");

const app = express();

app.use(cors({
    origin : ["https://rentinout.onrender.com" , "http://rentinout.onrender.com" , "http://localhost:3000"],
    credentials: true,
}));
app.use(fileUpload({ limits: { fileSize: 1024 * 1024 * 5 } }))
app.use(cookieParser());
app.use(express.json());
app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")))

routesInit(app);

const server = http.createServer(app);

let port = process.env.PORT || 3000
server.listen(port);