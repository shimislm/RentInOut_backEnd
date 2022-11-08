const express = require("express");
const path = require("path");
const http = require("http");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { routesInit} = require("./routers/config_routes")
require("dotenv").config()
require("./db/mongoconnect");

const app = express();

app.use(cors());

app.use(fileUpload({limits:{fileSize: 1024 * 1024 * 5 }}))

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")))

routesInit(app);

const server = http.createServer(app);

let port = process.env.PORT || 3000
server.listen(port);