import { homepageController } from "./controllers/homepage/homepage.controller";
import { ProductController } from "./controllers/product/product.controller";
import { apiErrorHandler } from "../middleware/error.middleware";
import { CustomerController } from "./controllers/customer/customer.controller";
import { OrderController } from "./controllers/order/order.controller";
import express = require('express');
import cors = require('cors');
import { hasAnyRole, oAuthModel } from "../middleware/auth.middleware";
const ExpresOAuthServer = require('@node-oauth/express-oauth-server');

export const server = express();

// Allow CORS for process.env.CORS_ORIGIN
server.use(
    cors({
        origin: process.env.CORS_ORIGIN,
    })
);
console.log("Allowed CORS for", process.env.CORS_ORIGIN);

// Security
const auth = new ExpresOAuthServer({ model: oAuthModel });

// Middleware to parse JSON and URL-encoded data
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Homepage
server.get("/", homepageController.homepage);

// Customers
const customerController = new CustomerController();
server.post("/customers/register", customerController.register);
server.post("/customers/login", customerController.login);
server.get("/customers/:id", [auth.authenticate()], customerController.getById);
server.put("/customers/:id", [auth.authenticate()], customerController.update);
server.get("/customers/search", [auth.authenticate()], customerController.search);
server.get("/customers/me/orders", [auth.authenticate()], customerController.getCustomerOrder);


// Products
const productController = new ProductController();
server.get("/products", productController.getAll);
server.get("/products/:id", productController.getById);
server.post("/products", [auth.authenticate(), hasAnyRole("ADMIN")], productController.create);
server.put("/products/:id", [auth.authenticate(), hasAnyRole("ADMIN")], productController.update);
server.delete("/products/:id", [auth.authenticate(), hasAnyRole("ADMIN")], productController.delete);

// Orders
const orderController = new OrderController();
server.post("/orders", [auth.authenticate()], orderController.createOrder);
server.get("/orders/:id", [auth.authenticate()], orderController.getOrderById);
server.put("/orders/:id", [auth.authenticate()], orderController.updateOrderStatus);
server.delete("/orders/:id", [auth.authenticate(), hasAnyRole("ADMIN")], orderController.deleteOrder);

// Middleware: Error handling
server.use(apiErrorHandler);
