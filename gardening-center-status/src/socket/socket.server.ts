import { Server } from "socket.io";
import * as http from "node:http";
import { orderStatusService } from "../business/orderStatus.service";
import { WarningCreateDto } from "../api/controllers/warning/warning.create.dto";

let sockets = {};
let io = null;
let subscriptions: Map<string, Array<string>> = new Map();

export const socketServer = {
    init(httpServer: http.Server) {
        io = new Server(httpServer, {
            cors: {
                origin: process.env.CORS_ORIGIN.split(',')
            }
        });

        io.on("connection", (socket) => {
            console.log("Socket.io: A new user " + socket.id + " connected");

            sockets[socket.id] = socket;

            socket.on('message', (message: string) => console.log('Socket.io: Received message', message));
            socket.on('subscribeToOrder', (orderId: string) => this.subscribeToOrder(socket.id, orderId));
            socket.on('disconnect', () => {
                console.log('Socket.io: User ' + socket.id + ' disconnected');
                this.removeSocketFromSubscriptions(socket.id);
            });
        });

        console.log('Socket.io: Initialized');
    },

    send(socketId: string, event: string, data: any) {
        if (sockets[socketId]) {
            console.log('Socket.io: Sending to ' + socketId + ' event ' + event, data);
            sockets[socketId].emit(event, data);
        }
    },

    async subscribeToOrder(socketId: string, orderId: string) {
        console.log('Socket.io: User ' + socketId + ' subscribed to order ' + orderId);

        // First, send the last known status
        const status = await orderStatusService.getLastStatus(orderId);

        if (status) {
            this.send(socketId, 'order', status);
        }

        // Then, subscribe to future updates
        if (!subscriptions.has(orderId)) {
            subscriptions.set(orderId, []);
        }

        subscriptions.get(orderId).push(socketId);
    },

    sendOrderStatusToSubscribers(orderId: string, data: any) {
        console.log('Socket.io: Broadcasting order status for order ' + orderId, data);

        subscriptions.get(orderId)?.forEach(socketId =>
            this.send(socketId, 'order', data)
        );
    },

    broadcastWarning(warning: WarningCreateDto) {
        console.log('Socket.io: Broadcasting warning', warning);
        io.emit('warning', warning);
    },

    removeSocketFromSubscriptions(socketId: string) {
        console.log('Socket.io: Removing socket ' + socketId + ' from subscriptions');
        subscriptions.forEach((subscribers, orderId) => {
            const index = subscribers.indexOf(socketId);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
            // Clean up empty subscription lists
            if (subscribers.length === 0) {
                subscriptions.delete(orderId);
            }
        });
    }
};
