const pool = require("../../db");
const userQueries = require("../../queries").users;

const getUserByEmail = (req, res) => {
    const email = req.params.email;
    pool.query(userQueries.getUserByEmail, [email], (error, results) => {
        if (error) throw error;

        res.status(200).json(results.rows[0]);
    })
};

const login = async (req, res, next) => {
    const { email, password } = req.body;
    pool.query(userQueries.getUserByEmail, [email], (error, results) => {
        if (error) throw error;

        const user = results.rows[0];
        if (!user) {
            const error = new Error("User with that email not found");
            error.status = 403;
            return next(error);
        }
        
        if (user.password === password) {
            req.session.authenticated = true;
            req.session.user = {
                email, password
            }
            console.log(req.session);
            res.json(req.session.user);
        } else {
            //Example error throwing
            const error = new Error("Invalid password");
            error.status = 403;
            return next(error);
        }
    })
}

module.exports = {
    getUserByEmail,
    login
}