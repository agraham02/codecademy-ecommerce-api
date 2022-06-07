const express = require("express");
const productsRouter = express.Router();
const db = require("../queries");

productsRouter.get("/", db.getProducts);

productsRouter.get("/:id", db.getProductById);

module.exports = productsRouter;