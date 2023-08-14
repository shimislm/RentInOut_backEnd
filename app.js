const express = require("express");
require("./helpers/passport")
const path = require("path");
const http = require("http");
const cors = require("cors");
const {Server} = require("socket.io")
const passport = require("passport");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const { routesInit } = require("./routers/config_routes");
const {sockets} = require( "./routers/socket");
require("dotenv").config()
require("./db/mongoconnect");

const app = express();

app.use(cors({
    origin : ["https://rentinout.onrender.com" , "http://rentinout.onrender.com" , "http://localhost:3000", "https://rentinout.netlify.app"],
    credentials: true,
}));
app.use(fileUpload({ limits: { fileSize: 1024 * 1024 * 5 } }))
app.use(express.json());
app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")))
routesInit(app);

const server = http.createServer(app);
//socket io
const io = new Server(server, {
    cors: {
        origin : ["https://rentinout.onrender.com" , "http://rentinout.onrender.com" , "http://localhost:3000", "https://rentinout.netlify.app" , "http://localhost:3001"]
    }
})
app.get("/" , (req,res)=> {
  res.json("Socket ready")
})
let port = process.env.PORT || 3001
server.listen(port , ()=>{  
    console.log(`Server is running on port: ${port}`)
});
io.on('connection', sockets)

