const express = require("express");
const pool = require("../dbConfig");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { users, order } = require("../queries");
const accountRouter = express.Router();

//might have as route middleware
function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("Is logged in");
      return next();
    } else {
        console.log("Need to logged in");
      res.redirect("/login");
    }
}

accountRouter.get("/", checkAuthentication, async (req, res, next) => {
    try {
        user = await req.user;
        res.send(`${user.first_name}'s Account`);
        // res.send(user);
    } catch (error) {
        const e = new Error(`Server Error: ${error.message}`);
        e.status = 500;
        return next(e);
    }
});

//check if authorized before getting account
accountRouter.get("/:id", async (req, res, next) => {
    const id = req.params.id;
    try {
        const user = await req.user;
        if (user.id === id) { //or isAdmin
            const u = await users.getUserById(id);
            res.json(u);
        } else {
            const error = new Error("You are not authorised to view this account.");
            error.status = 403;
            return next(error);
        }        
    } catch (error) {
        const e = new Error(`Server Error: ${error.message}`);
        e.status = 500;
        return next(e);
    }
});

module.exports = accountRouter;