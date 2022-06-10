const { users, cart } = require("./queries");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;

const comparePasswords = async (password, hash) => {
    try {
        return await bcrypt.compare(password, hash);
    } catch(error) {
        console.log(error);
    }
    return false;
};

function initializePassport(passport) {
    const authenticateUser = async (email, password, done) => {
        try {
            const user = await users.getUserByEmail(email);
            if (!user) {
                console.log("User not found");
                return done(null, false, { message: "User not found" });
            }
            if (await comparePasswords(password, user.password)) {
                console.log("Authentication successful");
                return done(null, user);
            } else {
                console.log("Password is incorrect");
                return done(null, false, { message: "Password is incorrect" });
            }
        } catch (error) {
            return done(error);
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        try {
            const user = users.getUserById(id);
            done(null, user);
        } catch (error) {
            return done(error);
        }
    });
}

module.exports = initializePassport;