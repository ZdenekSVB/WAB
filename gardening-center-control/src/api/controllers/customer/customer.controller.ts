import 'reflect-metadata';
import { Request, Response } from 'express';
import { validateQuery, validateParams, validateBody } from "../../../middleware/validation.middleware";
import { SearchQuery, IdParam } from "../../../types/base.dto";
import { customerService } from "../../../business/customer.service";
import { ApiError } from "../../../types/api.error";
import { CustomerUpdateDto } from "./customer.update.dto";  // Import the DTO

export class CustomerController {
    // Search for customers by name
    async search(req: Request, res: Response) {
        const { query } = await validateQuery(req, SearchQuery);
        const users = await customerService.searchByName(query);
        res.status(200).send(users);
    }

    // Get the authenticated customer's orders
    async getCustomerOrder(req: Request, res: Response) {
        const user = res.locals.oauth?.token?.user;

        // Ensure that the user has been authenticated and exists
        if (!user?.email) {
            throw new ApiError("unauthorized", "User not authenticated", 401);
        }

        const userData = await customerService.getByEmail(user.email);

        if (!userData) {
            throw new ApiError("not found", "Customer not found", 404);
        }

        // Ensure that the customer has orders or reservations
        const orders = userData.orders || [];  // Use orders instead of reservations if that's the actual field name
        res.status(200).send(orders);
    }

    // Get customer by ID
    async getById(req: Request, res: Response) {
        const { id } = await validateParams(req, IdParam);
        const customer = await customerService.getById(id);

        if (!customer) {
            throw new ApiError("not found", "Customer not found", 404);
        }

        res.status(200).send(customer);
    }

    // Update customer by ID
    async update(req: Request, res: Response) {
        const { id } = await validateParams(req, IdParam);
        const updateData = await validateBody(req, CustomerUpdateDto);

        const updatedCustomer = await customerService.updateById(id, updateData);

        if (!updatedCustomer) {
            throw new ApiError("not found", "Customer not found", 404);
        }

        res.status(200).send(updatedCustomer);
    }

    // Register a new customer
    async register(req: Request, res: Response) {
        const registerData = await validateBody(req, CustomerUpdateDto); // Assuming registration uses a similar DTO
        const newCustomer = await customerService.register(registerData);

        res.status(201).send(newCustomer);
    }

    // Login an existing customer
    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new ApiError("bad request", "Email and password are required", 400);
        }

        const token = await customerService.login(email, password);

        if (!token) {
            throw new ApiError("unauthorized", "Invalid credentials", 401);
        }

        res.status(200).send({ token });
    }
}
