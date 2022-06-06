const express = require("express");
const server = express();
const PORT =  process.env.PORT || 3000;
const db = require("./queries");

server.get("/", (req, res) => {
    res.send("Shop home");
});

server.get("/products", db.getProducts);

server.get("/products/:id", db.getProductById);

server.get("/products/departments/:department", db.getProductsByDepartment);

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});