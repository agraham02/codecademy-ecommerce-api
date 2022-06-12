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
    console.log(street);
    await checkout.addNewShippingAddress(street, city, state, zipCode, saveShipping ? user.id : null);
    //get shipping id
    const { id } = await checkout.getAddressByAddress(street, city, state, zipCode);
    // const userCart = await cart.getCartByUserId(user.id);
    checkout.updateCartShippingAddress(id, user.id);
    res.send("Got shipping");
    //might send back shipping info
    //might have shipping and payment be called in the same request
});

checkoutRouter.post("/processPayment", async (req, res) => {
    const { cardNumber, type, billingAddressId, savePayment } = req.body;
    const user = await req.user;
    //get paymentId
    await checkout.addNewPayment(cardNumber, type, savePayment ? user.id : null, billingAddressId);
    const { id } = await checkout.getPaymentByPayment(cardNumber, type, billingAddressId);
    console.log(id);
    await checkout.updateCartPayment(id, user.id); //fix this (not working)
    res.send("Got payment");
});

checkoutRouter.post("/finalizeOrder", async (req, res) => {
    //check if cart is not empty first
    const user = await req.user;
    const userCart = await cart.getCartByUserId(user.id);
    const { contents, total, payment_id, shipping_address_id } = userCart;
    const taxPrice = parseFloat(total) * TAX;
    const orderTotal = parseFloat(total) + taxPrice;
    console.log( total);
    console.log( taxPrice);
    console.log( orderTotal);
    await checkout.finalizeOrder(payment_id, parseFloat(total), taxPrice, orderTotal, contents, shipping_address_id, user.id);
    await cart.clearCart(user.id);
    res.send("Your order is confirmed");
});

module.exports = checkoutRouter;