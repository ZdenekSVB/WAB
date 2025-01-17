import 'reflect-metadata';
import { Request, Response } from 'express';
import { validateBody, validateParams } from "../../../middleware/validation.middleware";
import { IdParam } from "../../../types/base.dto";
import { OrderCreateDto } from "./order.create.dto";
import { customerService } from "../../../business/customer.service";
import { ApiError } from "../../../types/api.error";
import { orderService } from "../../../business/order.service"; // Assuming an order service exists

export class OrderController {

    // Create a new order
    async createOrder(req: Request, res: Response) {
        const { id } = await validateParams(req, IdParam);
        const dto = await validateBody(req, OrderCreateDto);

        const customer = await customerService.getById(dto.userId);
        if (!customer) {
            throw new ApiError('not found', 'Customer not found', 404);
        }

        // Create order
        await orderService.createOrder(dto, customer);
        res.status(201).send();
    }

    // Get order by ID
    async getOrderById(req: Request, res: Response) {
        const { id } = await validateParams(req, IdParam);

        const order = await orderService.getById(id);
        if (!order) {
            throw new ApiError('not found', 'Order not found', 404);
        }

        res.status(200).json(order);
    }

    // Update order status
    async updateOrderStatus(req: Request, res: Response) {
        const { id } = await validateParams(req, IdParam);
        const { status } = req.body;

        if (!status) {
            throw new ApiError('bad request', 'Status is required', 400);
        }

        const order = await orderService.getById(id);
        if (!order) {
            throw new ApiError('not found', 'Order not found', 404);
        }

        await orderService.updateStatus(id, status);
        res.status(200).send();
    }

    // Delete order
    async deleteOrder(req: Request, res: Response) {
        const { id } = await validateParams(req, IdParam);

        const order = await orderService.getById(id);
        if (!order) {
            throw new ApiError('not found', 'Order not found', 404);
        }

        await orderService.delete(id);
        res.status(204).send();
    }
}
