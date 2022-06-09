const express = require("express");
const { products  } = require("../queries");
const productsRouter = express.Router();

productsRouter.get("/", async (req, res) => {
    const department = req.query.department;
    let results;
    if (department) {
        results = await products.getProductsByDepartment(department);
    } else {
        results = await products.getProducts();
    }
    res.json(results);
})

productsRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    const result = await products.getProductById(id);
    res.json(result);
});

module.exports = productsRouter;