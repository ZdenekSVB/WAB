import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Response, NextFunction } from 'express';
import {BaseRequest} from "../types/base.request";

export async function validateData(dtoClass: any, data: any) {
    const object = plainToInstance(dtoClass, data);
    const errors = await validate(object);

    if (errors.length > 0) {
        const errorMessages = errors.map((error) => Object.values(error.constraints!)).flat();
        throw { errorMessages }
    }

    return object;
}

export function validateRequest(type: BaseRequest) {
    return async (req: typeof type, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (type.queryDto) {
                req.queryDto = await validateData(type.queryDto, req.query);
            }

            if (type.paramsDto) {
                req.paramsDto = await validateData(type.paramsDto, req.params);
            }

            if (type.bodyDto) {
                req.bodyDto = await validateData(type.bodyDto, req.body);
            }

            next();
        } catch (error) {
            console.log(error)
            res.status(400).json({ message: error.errorMessages });
        }
    }
}