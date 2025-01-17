
import { Max, Min } from "class-validator";

export class OrderStatusCreateDto {
    @Min(-90)
    @Max(90)
    latitude: number;

    @Min(-180)
    @Max(180)
    longitude: number;
}