const express = require("express");
const accountRouter = express.Router();
const pool = require("../db");
const accountController = require("./controllers/accountController");

accountRouter.get("/", (req, res) => {
    res.send("Your Account");
});

accountRouter.get("/login", (req, res) => {
    res.send("Login Page");
});

accountRouter.post("/login", accountController.login);

module.exports = accountRouter;