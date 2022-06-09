const pool = require("./dbConfig");
const { productQueries, userQueries, cartQueries} = require("./queriesText");

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
    }
};