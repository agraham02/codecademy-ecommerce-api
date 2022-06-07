const Pool = require("pg").Pool;
const pool = new Pool({ //should be in a seperate, protected file
    user: "postgres",
    host: "localhost",
    database: "codecademy_e_commerce",
    password: "postgres",
    port: 5432
});

module.exports = pool;