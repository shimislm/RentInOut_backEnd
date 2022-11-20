const indexR = require("./index");
const usersR = require("./users");
const postR = require("./posts");
const categoriesR = require("./categories");
const uploadsR = require("./uploads");
const refreshR = require("./refresh");
const logoutR = require("./logout");

exports.routesInit = (app) => {
    app.use("/", indexR);
    app.use("/users", usersR);
    app.use("/posts", postR);
    app.use("/categories", categoriesR);
    app.use("/uploads", uploadsR);
    app.use("/refresh" , refreshR);
    app.use("/logout" , logoutR);
}