const express = require("express");
const { products  } = require("../db/queries");
const productsRouter = express.Router();

productsRouter.get("/", async (req, res, next) => {
    const department = req.query.department;
    console.log(department);
    let results;
    try {
        if (department) {
            results = await products.getProductsByDepartment(department);
        } else {
            results = await products.getProducts();
        }
        res.json(results);        
    } catch (error) {
        const e = new Error(`Server Error: ${error.message}`);
        e.status = 500;
        return next(e);
    }
})

productsRouter.get("/:id", async (req, res, next) => {
    const id = req.params.id;
    try {
        const result = await products.getProductById(id);
        res.json(result);        
    } catch (error) {
        const e = new Error(`Server Error: ${error.message}`);
        e.status = 500;
        return next(e);
    }
});

module.exports = productsRouter;