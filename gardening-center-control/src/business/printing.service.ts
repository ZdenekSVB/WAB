import {loadProto} from "../proto/proto-loader";
import {Config} from "../../config";
import {OrderCreateDto} from "../api/controllers/order/order.create.dto";
import {PrintedTicket} from "../types/PrintedTicket";

const grpc = require('@grpc/grpc-js');


const ticketProto = loadProto('ticket');
const client = new ticketProto.TicketService(
    process.env.TICKET_SERVICE_URL || 'localhost:50051',
    grpc.credentials.createInsecure()
);

export const printingService = {

    async print(flight: any, reservation: OrderCreateDto) {
        const ticket: PrintedTicket = {
            userId: reservation.userId,
            flightId: flight.id,
            seatNumber: reservation.seatNumber,
            departure: flight.departure,
        }
        console.log('Printing ticket:', ticket);

        // Send ticket data to the printing service via gRPC
        await new Promise((resolve, reject) => {
            client.PrintTicket(ticket, (error, response) => {
                if (error) {
                    console.error("Error sending ticket data:", error);
                    reject(error);
                } else {
                    console.log("Response from server:", response.message);
                    resolve(response);
                }
            })
        })
    }

}