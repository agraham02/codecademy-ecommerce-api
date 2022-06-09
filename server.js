//Imports
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const errorHandler = require("errorhandler");
const session = require("express-session");
const passport = require("passport");
const initializePassport = require("./passportConfig");
const bcrypt = require("bcrypt");
const flash = require("express-flash");
const pgSession = require("connect-pg-simple")(session);
//
const pool = require("./dbConfig");
const queries = require("./queries");
//Routes
const productsRouter = require("./routes/productRoutes");
const cartRouter = require("./routes/cartRoutes");
const ordersRouter = require("./routes/orderRoutes");
const accountRouter = require("./routes/accountRoutes");
const logInRouter = require("./routes/logInRoutes");

//Server setup
const app = express();
const PORT =  process.env.PORT || 3000;
initializePassport(passport);

app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const store = new session.MemoryStore(); //need to replace this with database storage
app.use(session({
    secret: "BBunnyX9", //should be an environment variable
    cookie: {
        maxAge: 1000 * 60 *60 * 24,
        // secure: true,
        // sameSite: "none"
    },
    resave: false,
    saveUninitialized: false,
    store: new pgSession({
        pool: pool,
        tableName: 'user_sessions',
        createTableIfMissing: true
    })
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));

//Use routes
app.use("/products", productsRouter);
app.use("/account", accountRouter);
// app.use("/cart", cartRouter);
// app.use("/orders", ordersRouter);
app.use("/", logInRouter);

app.get("/", (req, res) => {
    res.send("Codecademy E-Commerce Store Home");
});

app.use(errorHandler());

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});