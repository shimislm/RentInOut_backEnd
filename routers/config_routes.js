const indexR = require("./index");
const usersR = require("./users");
const productsR = require("./products");
const categoriesR = require("./categories");
const uploadsR = require("./uploads");

exports.routesInit = (app) => {
    app.use("/", indexR);
    app.use("/users", usersR);
    app.use("/products", productsR);
    app.use("/categories", categoriesR);
    app.use("/uploads", uploadsR);
}