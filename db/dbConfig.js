const Pool = require("pg").Pool;
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({ //should be in a seperate, protected file
    user: "postgres",
    host: "localhost",
    database: "codecademy_e_commerce",
    password: "postgres",
    port: 5432
});

module.exports = pool;