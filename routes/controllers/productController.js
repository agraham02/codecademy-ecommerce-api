const pool = require("../../db");
const productQueries = require("../../queries").products;

const getProducts = (req, res) => {
    const department = req.query.department;
    if (department) {
        pool.query("SELECT product.*, department.name AS department FROM product, department WHERE product.department_id = department.id AND department.name = $1", [department], (error, results) => {
            if (error) {
                console.error(error);
                throw error;
            }
            res.status(200).json(results.rows);
        });
    }
    else {
        pool.query("SELECT * FROM product ORDER BY department_id", (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).json(results.rows);
        });        
    }
};

const getProductById = (req, res) => {
    const id = parseInt(req.params.id);

    pool.query("SELECT * FROM product WHERE id = $1", [id], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

module.exports = {
    getProducts,
    getProductById
}