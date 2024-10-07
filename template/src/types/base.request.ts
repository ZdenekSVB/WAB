import {Request} from "express";
import {IsEmail, IsInt, IsNotEmpty, Length, Min} from 'class-validator';
import {Type} from "class-transformer";

export interface BaseRequest extends Request {
    queryDto?: any
    paramsDto?: any
    bodyDto?: any
}

export class PagingQueryDto {
    @IsInt({ message: 'Page must be an integer' })
    @Min(1, { message: 'Page must be at least 1' })
    @Type(() => Number) // Automatically converts the query param to a number because all query params are strings by default
    page?: number;
}

export class IdParamsDto {
    @IsNotEmpty({ message: 'Id is required' })
    @Length(24, 24, { message: 'Id must have 24 characters' })
    id?: string;
}

