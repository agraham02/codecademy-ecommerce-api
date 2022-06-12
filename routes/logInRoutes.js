const express = require("express");
const passport = require("passport");
const queries = require("../queries");
const bcrypt = require("bcrypt");
const logInRouter = express.Router();

const passwordHash = async (password, saltRounds) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw error;
    }
};

logInRouter.get("/login", (req, res) => {
    res.send("Login Page");
});

logInRouter.post("/login", passport.authenticate("local", { successRedirect: "/account", failureRedirect: "/login", failureFlash: true }));

logInRouter.get("/register", (req, res) => {
    res.send("Register Page");
});

logInRouter.post("/register", async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        const user = await queries.users.getUserByEmail(email);
        if (user) {
            //there's already a user with that email
            console.log("There's already a user with that email")
            const error = new Error("A user with that email already exists");
            error.status = 406;
            return next(error);
        }
    
        const hashedPassword = await passwordHash(password, 10);
        queries.users.addNewUser(firstName, lastName, email, hashedPassword);
        const u = await queries.users.getUserByEmail(email);
        queries.cart.createNewCart(u.id);
        res.redirect("/login");        
    } catch (error) {
        const e = new Error(`Server Error: ${error.message}`);
        e.status = 500;
        return next(e);
    }
});

logInRouter.post("/logout", (req, res, next) => {
    req.logOut((error) => {
        if (error) {
            return next(error);
        }
        res.redirect("/");
    });
});


module.exports = logInRouter;