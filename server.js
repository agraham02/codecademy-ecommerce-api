//Imports
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const errorHandler = require("errorhandler");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
//Routes
const productsRouter = require("./routes/productRoutes");
const cartRouter = require("./routes/cartRoutes");
const ordersRouter = require("./routes/orderRoutes");
const accountRouter = require("./routes/accountRoutes");

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
server.use("/cart", cartRouter);
server.use("/orders", ordersRouter);
server.use("/account", accountRouter);

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

server.use(errorHandler());

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});