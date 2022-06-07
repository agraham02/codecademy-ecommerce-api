//Imports
const express = require("express");
const { append } = require("express/lib/response");
const db = require("./queries");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const errorHandler = require("errorhandler");
const session = require("express-session");
//Routes
const productsRouter = require("./routes/productRoutes");
const { user } = require("pg/lib/defaults");

//Server setup
const server = express();
const PORT =  process.env.PORT || 3000;

server.use(morgan("dev"));

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

const store = new session.MemoryStore(); //need to replace this with database storage
server.use(session({
    secret: "BBunnyX9", //should be an environment variable
    cookie: {
        maxAge: 1000 * 60 *60 * 24,
        secure: true,
        sameSite: "none"
    },
    resave: false,
    saveUninitialized: false,
    store
}));

server.use("/products", productsRouter);

function ensureAuthentication(req, res, next) {
    // Complete the if statmenet below:
    if (req.session.authenticated) {
      return next();
    } else {
      res.status(403).json({ msg: "You're not authorized to view this page" });
    }
  }

server.get("/", (req, res) => {
    res.send("Codecademy E-Commerce Store Home");
});

server.get("/login", (req, res) => {
    res.send("Login Page");
});

const oldUuser = {
    email: "acgraham02@gmail.com",
    password: "Farkle02"
}
server.post("/login", (req, res, next) => {
    const { email, password } = req.body;
    if (oldUuser.password === password) {
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
});

server.use(errorHandler());

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});