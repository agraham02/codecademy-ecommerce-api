const express = require("express");
const {products, cart } = require("../db/queries");
const cartRouter = express.Router();

//might use middleware to check if user is logged in
function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("Is logged in");
      return next();
    } else {
        console.log("Need to logged in");
      res.redirect("/login");
    }
}

cartRouter.use(checkAuthentication);

cartRouter.get("/", async (req, res, next) => {
    //want: cart_id, user_id, { product, quantity}, total
    const user = await req.user;
    try {
        const userCart = await cart.getCartByUserId(user.id);
        const productsInfo = [];
        const contents = userCart.contents;
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
        const yourCart = {...userCart, contents: productsInfo};
        res.status(200).json(yourCart);        
    } catch (error) {
        const e = new Error(`Server Error: ${error.message}`);
        e.status = 500;
        return next(e);
    }
});

cartRouter.put("/update", async (req, res, next) => {
    const {productId, quantity} = req.body;
    try {
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
            res.status(201).redirect("/cart");
        }
        else {
            const error = new Error("Could not update cart (invalid parameters)");
            error.status = 406;
            return next(error);
        }        
    } catch (error) {
        const e = new Error(`Server Error: ${error.message}`);
        e.status = 500;
        return next(e);
    }
});

cartRouter.put("/clear", async (req, res, next) => {
    try {
        const user = await req.user;
        await cart.clearCart(user.id);
        res.status(201).redirect("/cart");        
    } catch (error) {
        const e = new Error(`Server Error: ${error.message}`);
        e.status = 500;
        return next(e);
    }
});

cartRouter.put("/removeItem", async (req, res, next) => {
    const {productId} = req.body;
    try {
        const user = await req.user;
        const userCart = await cart.getCartByUserId(user.id);
        const product = await products.getProductById(productId);
        let contents = userCart.contents;
        if (contents[productId]) {
            const priceToSubtract = (product.price * -1) * contents[productId].quantity;
            delete contents[productId];
            await cart.updateCartContentsForUser(JSON.stringify(contents), user.id);
            await cart.updateCartPriceForUser(priceToSubtract, user.id);
            res.status(201).redirect("/cart");
        }
        else {
            const error = new Error("Could not update cart");
            error.status = 406;
            return next(error);
        }        
    } catch (error) {
        const e = new Error(`Server Error: ${error.message}`);
        e.status = 500;
        return next(e);
    }
});

module.exports = cartRouter;