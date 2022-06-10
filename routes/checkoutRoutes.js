const express = require("express");
const checkoutRouter = express.Router();
const { checkout, cart, order } = require("../queries");

const TAX = 0.053;

//gets payment details, shipping info, and tax from this step
//gets subtotal, contents from cart
//gets user from login in session

checkoutRouter.get("/", (req, res) => {
    res.send("Checkout");
});

checkoutRouter.post("/processShipping", async (req, res) => {
    const { street, city, state, zipCode, saveShipping } = req.body;
    const user = await req.user;
    await checkout.addNewShippingAddress(street, city, state, zipCode, saveShipping ? user.id : null);
    res.send("Got shipping");
});

checkoutRouter.post("/processPayment", async (req, res) => {
    const { cardNumber, type, userId, billingAddressId, savePayment } = req.body;
    const user = await req.user;
    await checkout.addNewPayment(cardNumber, type, savePayment ? userId : null, billingAddressId);
    res.send("Got payment");
});

checkoutRouter.post("/finalizeOrder", async (req, res) => {
    //check if cart is not empty first
    const {paymentId, shipping_address_id } = req.body;
    const user = await req.user;
    const userCart = await cart.getCartByUserId(user.id);
    const { contents, total } = userCart;
    const taxPrice = parseFloat(total) * TAX;
    const orderTotal = parseFloat(total) + taxPrice;
    console.log( total);
    console.log( taxPrice);
    console.log( orderTotal);
    await checkout.finalizeOrder(paymentId, parseFloat(total), taxPrice, orderTotal, contents, shipping_address_id);
    await cart.clearCart(user.id);
    res.send("Your order is confirmed");
});

module.exports = checkoutRouter;