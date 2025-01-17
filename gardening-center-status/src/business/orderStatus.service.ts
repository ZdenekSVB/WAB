import { OrderStatusCreateDto } from "../api/controllers/orderStatus/orderStatus.create.dto";
import { ObjectId } from 'mongodb';
import { OrderStatus } from "../persistence/models/orderStatus.model";

export const orderStatusService = {
    async create(orderId: string, data: OrderStatusCreateDto) {
        const status = new OrderStatus(data);
        status.orderId = new ObjectId(orderId);
        status.timestamp = new Date();
        return await status.save();
    },

    async getLastStatus(orderId: string) {
        return OrderStatus.findOne({ orderId }).sort({ timestamp: -1 });
    },
};
