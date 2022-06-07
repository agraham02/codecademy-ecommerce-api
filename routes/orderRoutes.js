const express = require("express");
const ordersRouter = express.Router();
const db = require("../queries");

ordersRouter.get("/", (req, res) => {
    res.send("Your Orders");
});

module.exports = ordersRouter;