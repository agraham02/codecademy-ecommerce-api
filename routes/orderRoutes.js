const express = require("express");
const ordersRouter = express.Router();
const { order } = require("../db/queries");

ordersRouter.get("/", async (req, res, next) => {
    try {
        const user = await req.user;
        const orders = await order.getOrdersByUserId(user.id);
        res.status(200).json(orders);        
        
    } catch (error) {
        const e = new Error(`Server Error: ${error.message}`);
        e.status = 500;
        return next(e);
    }
});

ordersRouter.get("/:id", async (req, res, next) => {
    const orderId = req.params.id;
    try {
        const user = await req.user;
        const userOrder = await order.getOrderById(orderId);
        if (userOrder.customer_id === user.id) {
            res.status(200).json(userOrder);
        } else {
            const error = new Error("You are not authorised to view this order.");
            error.status = 403;
            return next(error);
        }
    } catch (error) {
        const e = new Error(`Server Error: ${error.message}`);
        e.status = 500;
        return next(e);
    }
});

ordersRouter.put("/:id/cancel", async (req, res, next) => {
    const orderId = req.params.id;
    try {
        const user = await req.user;
        const userOrder = await order.getOrderById(orderId);
        if (userOrder.customer_id === user.id) {
            await order.cancelOrderByOrderId(orderId);
            res.status(200).redirect("/orders");
        } else {
            const error = new Error("You are not authorised to cancel this order.");
            error.status = 403;
            return next(error);
        }
    } catch (error) {
        const e = new Error(`Server Error: ${error.message}`);
        e.status = 500;
        return next(e);
    }
})

module.exports = ordersRouter;