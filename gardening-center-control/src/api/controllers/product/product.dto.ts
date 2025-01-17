import { IsNotEmpty, Length, Max, Min } from 'class-validator';

export class ProductDto {
    @IsNotEmpty()
    @Length(3, 10)
    name: string;

    @IsNotEmpty()
    @Length(3, 50)
    type: string;  // Changed from 'model' to 'type' for plant types

    @Min(0)
    @Max(1000)
    price: number;  // Price of the plant

    @Min(0)
    quantityInStock: number;  // Quantity in stock
}
