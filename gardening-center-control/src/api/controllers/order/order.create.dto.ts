import { IsNotEmpty, Length, Matches, IsArray, ArrayMinSize, ValidateNested } from 'class-validator';
import { OrderItemDto } from './order-item.dto'; // Assuming you have a DTO for individual items

export class OrderCreateDto {

    @IsNotEmpty()
    @Length(1, 5)
    @Matches(/^[1-9][0-9]{0,2}[A-Z]?$/)
    seatNumber: string;

    @IsNotEmpty()
    userId: string;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    items: OrderItemDto[];  // Add the items property as an array of OrderItemDto
}
