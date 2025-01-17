import { Order, OrderStatus } from "../persistence/models/order.model";
import { ObjectId } from "mongodb";
import { OrderCreateDto } from "../api/controllers/order/order.create.dto";

export const orderService = {
    // Get order by ID
    async getById(id: string) {
        return Order.findById(id);
    },

    // Create a new order with items
    async createOrder(orderData: OrderCreateDto, customer: any) {
        const itemsBase = orderData.items.map(item => ({
            plantId: new ObjectId(item.plantId),
            quantity: item.quantity,
            price: item.price,
        }));

        // Calculate total price
        const totalPrice = itemsBase.reduce((total, item) => total + item.quantity * item.price, 0);

        // Create a new order
        const order = new Order({
            customerId: new ObjectId(customer._id),
            items: itemsBase,
            status: OrderStatus.pending,
            totalPrice,
        });

        await order.save();

        // Link the order to the customer (optional)
        customer.orders.push(order._id);
        await customer.save();
    },

    // Update order status
    async updateStatus(id: string, status: OrderStatus) {
        return Order.findByIdAndUpdate(id, { status, updatedAt: new Date() }, { new: true });
    },

    // Delete order
    async delete(id: string) {
        return Order.findByIdAndDelete(id);
    },

    // Get item from order by plantId (can be used for validations)
    getItem(order: any, plantId: string) {
        return order.items.find((item: any) => item.plantId.toString() === plantId);
    },
};
