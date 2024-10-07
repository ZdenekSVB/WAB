import {IsNotEmpty, Length, Min} from "class-validator";
import {BaseRequest, IdParamsDto} from "../../../types/base.request";

export class AircraftBodyDto {
    @IsNotEmpty()
    @Length(3,10)
    name: string;

    @IsNotEmpty()
    @Length(5,15)
    model:string;

    @IsNotEmpty()
    @Min(0)
    capacity:number;
}

export const AircraftCreateRequest = {
    bodyDto: AircraftBodyDto
} as any & BaseRequest

export const AircraftGetByIdRequest = {
    paramsDto: IdParamsDto
} as any & BaseRequest