const express = require("express");
const { cart } = require("../queries");
const cartRouter = express.Router();
const db = require("../queries");

cartRouter.get("/", (req, res) => {
    res.send("Your cart");
});

cartRouter.post("/add", async (req, res, next) => {
    const {productId, quantity} = req.body;
    const user = await req.user;
    const userCart = await cart.getCartByUserId(user.id);
    // res.send(userCart);
    let contents = userCart.contents;
    const itemToAdd = {
        productId,
        quantity
    }
    //need to addjust
    // for (let i = 0; i < contents.length; i++) {
    //     const item = contents[i];
    //     if (item.productId === productId) {
    //         //update quantity
    //         contents[i].quantity += quantity;
    //         //update cart
    //         // next();
    //     } 
    // }
    contents = [...contents, itemToAdd];
    //update user cart
    await cart.updateCartContentsForUser(JSON.stringify(contents), user.id);
    res.send("Updated cart");
})

module.exports = cartRouter;