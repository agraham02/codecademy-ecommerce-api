const express = require("express");
const pool = require("../dbConfig");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { users } = require("../queries");
const accountRouter = express.Router();

function checkAuthentication(req, res, next) {
    // Complete the if statmenet below:
    if (req.isAuthenticated()) {
        console.log("Is logged in");
      return next();
    } else {
        console.log("Need to logged in");
      res.redirect("/login");
    }
}

accountRouter.get("/", checkAuthentication, async (req, res, next) => {
    const email = req.query.email;
    let user;
    if (email) {
        user = await users.getUserByEmail(email);
        res.send(user);
    } else {
        user = await req.user;
        res.send(`${user.first_name}'s Account`);
        // res.send(user);
    }
});

//check if authorized before getting account
accountRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    const user = await users.getUserById(id);
    res.send(user);
});



module.exports = accountRouter;