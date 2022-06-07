const express = require("express");
const productsRouter = express.Router();
const db = require("../queries");
const productController = require("./controllers/productController");

productsRouter.get("/", productController.getProducts);

productsRouter.get("/:id", productController.getProductById);

module.exports = productsRouter;