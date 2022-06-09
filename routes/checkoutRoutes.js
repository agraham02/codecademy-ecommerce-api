const express = require("express");
const checkoutRouter = express.Router();

checkoutRouter.get("/", (req, res) => {
    res.send("Checkout");
});

module.exports = checkoutRouter;