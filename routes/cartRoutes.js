const express = require("express");
const {products, cart } = require("../queries");
const cartRouter = express.Router();
const db = require("../queries");

//might use middleware to check if user is logged in

cartRouter.get("/", async (req, res) => {
    //want: cart_id, user_id, { product, quantity}, total
    const user = await req.user;
    const cartDB = await cart.getCartByUserId(user.id);
    const productsInfo = [];
    const contents = cartDB.contents;
    const keys = Object.keys(contents);
    for (const productId of keys) {
        const product = await products.getProductById(productId);
        const productToAdd = {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: contents[productId].quantity,
            itemTotalPrice: product.price * contents[productId].quantity
        }
        console.log(productToAdd);
        productsInfo.push(productToAdd);        
    }
    // console.log(productsInfo);
    const yourCart = {...cartDB, contents: productsInfo};
    res.send(yourCart);
});

cartRouter.put("/update", async (req, res, next) => {
    const {productId, quantity} = req.body;
    console.log(productId);
    const user = await req.user;
    const userCart = await cart.getCartByUserId(user.id);
    const product = await products.getProductById(productId);
    const totalToAdd = product.price * quantity;
    console.log(product);
    console.log(totalToAdd);
    let updated = false;
    // res.send(userCart);
    let contents = userCart.contents;
    if (contents[productId]) { //if product already in cart
        if ((quantity < 0 && contents[productId].quantity >= Math.abs(quantity)) || 
        (quantity > 0)) { // if quantity is negative and updating won't cause a negative value OR if quantity is positive and there is enough stock
            console.log("\tUptating existing item's quantity...");
            contents[productId].quantity += quantity;
            if (contents[productId].quantity === 0) {
                delete contents[productId];
            }
            updated = true;
        }
    }
    else if (quantity > 0) { //if product is not already in cart
        console.log("\tAdding new item to cart...");
        contents[productId] = {quantity};
        updated = true;
    }

    console.log(contents);
    if (updated) {
        //update user cart
        await cart.updateCartContentsForUser(JSON.stringify(contents), user.id);
        await cart.updateCartPriceForUser(totalToAdd, user.id);
        res.send("Updated cart");
    }
    else {
        res.send("Could not update cart (invalid parameters)");
    }
});

cartRouter.put("/clear", async (req, res) => {
    const user = await req.user;
    await cart.clearCart(user.id);
    res.send("cart cleared");
});

cartRouter.put("/removeItem", async (req, res) => {
    const {productId} = req.body;
    const user = await req.user;
    const userCart = await cart.getCartByUserId(user.id);
    const product = await products.getProductById(productId);
    let contents = userCart.contents;
    const priceToSubtract = (product.price * 1) * contents[productId].quantity;
    if (contents[productId]) {
        delete contents[productId];
        await cart.updateCartContentsForUser(JSON.stringify(contents), user.id);
        await cart.updateCartPriceForUser(priceToSubtract, user.id);
    }
    else {
        res.send("Could not find user");
    }
});

module.exports = cartRouter;