//Products
const getProducts = "SELECT * FROM product ORDER BY department_id";
const getProductById = "SELECT * FROM product WHERE id = $1";
const getProductsByDepartment = "SELECT product.*, department.name AS department FROM product, department WHERE product.department_id = department.id AND department.name = $1";

//User
const getUserByEmail = "SELECT * FROM customer WHERE email = $1";
const getUserById = "SELECT * FROM customer WHERE id = $1";
const addNewUser = "INSERT INTO customer (first_name, last_name, email, password) VALUES ($1, $2, $3, $4);"

//Cart

module.exports = {
    productQueries: {
        getProducts,
        getProductById,
        getProductsByDepartment
    },
    userQueries: {
        getUserByEmail,
        getUserById,
        addNewUser
    }
};