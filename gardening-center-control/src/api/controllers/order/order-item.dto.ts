import { IsNotEmpty, Min, Max } from 'class-validator';

export class OrderItemDto {

    @IsNotEmpty()
    plantId: string;  // Plant ID for each item

    @Min(1)
    quantity: number;  // Quantity of the plant ordered

    @Min(0)
    @Max(10000)
    price: number;  // Price per item
}
