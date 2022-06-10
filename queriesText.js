//Products
const getProducts = "SELECT * FROM product ORDER BY department_id";
const getProductById = "SELECT * FROM product WHERE id = $1";
const getProductsByDepartment = "SELECT product.*, department.name AS department FROM product, department WHERE product.department_id = department.id AND department.name = $1";

//User
const getUserByEmail = "SELECT * FROM customer WHERE email = $1";
const getUserById = "SELECT * FROM customer WHERE id = $1";
const addNewUser = "INSERT INTO customer (first_name, last_name, email, password) VALUES ($1, $2, $3, $4);"

//Cart
const addNewCart = "INSERT INTO users_cart (user_id) VALUES ($1)";
const insertIntoCart = "INSERT INTO carts_products (contents) VALUES ($1)";
const updateCartContentsForUser = "UPDATE users_cart SET contents = $1 WHERE user_id = $2";
const updateCartPriceForUser = "UPDATE users_cart SET total = total + $1 WHERE user_id = $2";
const getCartByUserId = "SELECT * FROM users_cart WHERE user_id = $1";
const clearCart = "UPDATE users_cart SET contents = DEFAULT, total = DEFAULT WHERE user_id = $1";

//Checkout
const addNewShippingAddress = "INSERT INTO address (street, city, state, zip_code, customer_id) VALUES ($1, $2, $3, $4, $5)";
const addNewPayment = "INSERT INTO payment (card_number, type, customer_id, billing_address_id) VALUES ($1, $2, $3, $4)";
const addNewOrder = "INSERT INTO public.order (payment_id, subtotal, tax, total, contents, shipping_address_id) VALUES ($1, $2, $3, $4, $5, $6)";

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
    },
    cartQueries: {
        addNewCart,
        insertIntoCart,
        updateCartContentsForUser,
        updateCartPriceForUser,
        getCartByUserId,
        clearCart
    },
    checkoutQueries: {
        addNewOrder,
        addNewShippingAddress,
        addNewPayment
    },
    orderQueries: {
        
    }
};