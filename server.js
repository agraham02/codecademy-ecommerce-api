const express = require("express");
const server = express();
const PORT = 3000;

server.get("/", (req, res) => {
    res.send("Hello there");
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});