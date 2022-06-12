const express = require("express");
const checkoutRouter = express.Router();
const { checkout, cart } = require("../db/queries");

const TAX = 0.053;

//gets payment details, shipping info, and tax from this step
//gets subtotal, contents from cart
//gets user from login in session

checkoutRouter.get("/", (req, res) => {
    res.send("Checkout");
});

checkoutRouter.post("/processShipping", async (req, res, next) => {
    const { street, city, state, zipCode, saveShipping } = req.body;
    try {
        const user = await req.user;
        let address = await checkout.getAddressByAddress(street, city, state, zipCode);
        console.log(address);
        if (!address) {
            console.log("\tAddress does not exist yet");
            await checkout.addNewShippingAddress(street, city, state, zipCode, saveShipping ? user.id : null);
            address = await checkout.getAddressByAddress(street, city, state, zipCode);
        }
        checkout.updateCartShippingAddress(address.id, user.id);
        res.status(201).send("Got shipping");
        //might send back shipping info
        //might have shipping and payment be called in the same request        
    } catch (error) {
        const e = new Error(`Server Error: ${error.message}`);
        e.status = 500;
        return next(e);
    }
});

checkoutRouter.post("/processPayment", async (req, res, next) => {
    const { cardNumber, type, billingAddressId, savePayment } = req.body;
    try {
        const user = await req.user;
        //get paymentId
        let payment = await checkout.getPaymentByPayment(cardNumber, type, billingAddressId);
        if (!payment) {
            console.log("\Payment does not exist yet");
            await checkout.addNewPayment(cardNumber, type, savePayment ? user.id : null, billingAddressId);
            payment = await checkout.getPaymentByPayment(cardNumber, type, billingAddressId);
        }
        await checkout.updateCartPayment(payment.id, user.id);
        res.status(201).send("Got payment");        
    } catch (error) {
        const e = new Error(`Server Error: ${error.message}`);
        e.status = 500;
        return next(e);
    }
});

checkoutRouter.post("/finalizeOrder", async (req, res, next) => {
    try {
        //check if cart is not empty first
        const user = await req.user;
        const userCart = await cart.getCartByUserId(user.id);
        if (Object.keys(userCart.contents).length === 0) {
            const error = new Error("Your cart is empty");
            error.status = 406;
            return next(error);
        }
        const { contents, total, payment_id, shipping_address_id } = userCart;
        if (!payment_id) {
            const error = new Error("Invalid payment");
            error.status = 406;
            return next(error);
        }
        if (!shipping_address_id) {
            const error = new Error("Invalid shipping address");
            error.status = 406;
            return next(error);
        }
        const taxPrice = parseFloat(total) * TAX;
        const orderTotal = parseFloat(total) + taxPrice;
        console.log( total);
        console.log( taxPrice);
        console.log( orderTotal);
        await checkout.finalizeOrder(payment_id, parseFloat(total), taxPrice, orderTotal, contents, shipping_address_id, user.id);
        await cart.clearCart(user.id);
        res.status(201).send("Your order is confirmed");        
    } catch (error) {
        const e = new Error(`Server Error: ${error.message}`);
        e.status = 500;
        return next(e);
    }
});

module.exports = checkoutRouter;