// OrderStatusController.ts
import 'reflect-metadata';
import { OrderStatusCreateDto } from "./orderStatus.create.dto";
import { Request, Response } from 'express';
import { validateBody, validateParams } from "../../../middleware/validation.middleware";
import { orderStatusService } from "../../../business/orderStatus.service";
import { IdParam } from "../../../types/base.dto";
import { socketServer } from "../../../socket/socket.server";

export class OrderStatusController {
    async create(req: Request, res: Response) {
        const { id } = await validateParams(req, IdParam);
        const dto = await validateBody(req, OrderStatusCreateDto);

        const status = await orderStatusService.create(id, dto);
        socketServer.sendOrderStatusToSubscribers(id, status);

        res.status(201).send(status);
    }
}
