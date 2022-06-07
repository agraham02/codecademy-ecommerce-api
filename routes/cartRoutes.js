const express = require("express");
const cartRouter = express.Router();
const db = require("../queries");

cartRouter.get("/", (req, res) => {
    res.send("Your cart");
});

module.exports = cartRouter;