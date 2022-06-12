const pool = require("./dbConfig");
const { productQueries, userQueries, cartQueries, checkoutQueries, orderQueries} = require("./queriesText");

//Products
//check for errors
const getProducts = async () => {
    const results = await (await pool.query(productQueries.getProducts)).rows;
    return results;
};

const getProductsByDepartment = async (department) => {
    const results = await (await pool.query(productQueries.getProductsByDepartment, [department])).rows;
    return results;
};

const getProductById = async (id) => {
    const result = await (await pool.query(productQueries.getProductById, [id])).rows[0];
    return result;
};

//Users
const getUserByEmail = async (email) => {
    const result = await (await pool.query(userQueries.getUserByEmail, [email])).rows[0];
    return result;
}

const getUserById = async (id) => {
    const result = await (await pool.query(userQueries.getUserById, [id])).rows[0];
    return result;
}

const addNewUser = async (firstName, lastName, email, hashedPassword) => {
    await pool.query(userQueries.addNewUser, [firstName, lastName, email, hashedPassword]);
}

//Cart
const createNewCart = async (userId) => {
    await pool.query(cartQueries.addNewCart, [userId]);
}

const getCartByUserId = async (userId) => {
    const result = await (await pool.query(cartQueries.getCartByUserId, [userId])).rows[0];
    return result;
}

const updateCartContentsForUser = async (content, userId) => {
    await pool.query(cartQueries.updateCartContentsForUser, [content, userId]);
}

const updateCartPriceForUser = async (priceToAdd, userId) => {
    await pool.query(cartQueries.updateCartPriceForUser, [priceToAdd, userId]);
}

const clearCart = async (userId) => {
    await pool.query(cartQueries.clearCart, [userId]);
}

//Checkout
const addNewShippingAddress = async (street, city, state, zip_code, user_id) => {
    await pool.query(checkoutQueries.addNewShippingAddress, [street, city, state, zip_code, user_id]);
}

const addNewPayment = async (cardNumber, type, userId, billingAddressId) => {
    await pool.query(checkoutQueries.addNewPayment, [cardNumber, type, userId, billingAddressId]);
}

const finalizeOrder = async (payment_id, subtotal, tax, total, contents, shipping_address_id, userId) => {
    await pool.query(checkoutQueries.addNewOrder, [payment_id, subtotal, tax, total, contents, shipping_address_id, userId]);
}

const updateCartShippingAddress = async (shipping_address_id, userId) => {
    await pool.query(checkoutQueries.updateCartShippingAddress, [shipping_address_id, userId]);
}

const updateCartPayment = async (payment_id, userId) => {
    await pool.query(checkoutQueries.updateCartPayment, [payment_id, userId]);
}

const getAddressByAddress = async (street, city, state, zipcode) => {
    const results = await pool.query(checkoutQueries.getAddressByAddress, [street, city, state, zipcode]);
    return results.rows[0];
}

const getPaymentByPayment = async (cardNumber, type, billingAddressId) => {
    const results = await pool.query(checkoutQueries.getPaymentByPayment, [cardNumber, type, billingAddressId]);
    return results.rows[0];
}

//Orders
const getOrdersByUserId = async (userId) => {
    const results = await (await pool.query(orderQueries.getOrdersByUserId, [userId])).rows;
    return results;
}

const getOrderById = async (orderId) => {
    const result = await (await pool.query(orderQueries.getOrderById, [orderId])).rows[0];
    return result;
}

const cancelOrderByOrderId = async (orderId) => {
    await pool.query(orderQueries.cancelOrderByOrderId, [orderId]);
}

module.exports = {
    products: {
        getProducts,
        getProductById,
        getProductsByDepartment
    },
    users: {
        getUserByEmail,
        getUserById,
        addNewUser
    },
    cart: {
        createNewCart,
        getCartByUserId,
        updateCartContentsForUser,
        updateCartPriceForUser,
        clearCart
    },
    checkout: {
        addNewShippingAddress,
        addNewPayment,
        finalizeOrder, 
        updateCartShippingAddress, 
        updateCartPayment,
        getAddressByAddress,
        getPaymentByPayment
    },
    order: {
        getOrdersByUserId,
        getOrderById,
        cancelOrderByOrderId
    }
};