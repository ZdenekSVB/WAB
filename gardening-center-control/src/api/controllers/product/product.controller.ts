import 'reflect-metadata';
import { ProductDto } from "./product.dto";
import { Request, Response } from 'express';
import { productService } from "../../../business/product.service";
import { validateBody, validateParams } from "../../../middleware/validation.middleware";
import { IdParam } from "../../../types/base.dto";

export class ProductController {

    // Get all plants
    async getAll(req: Request, res: Response) {
        const plants = await productService.getAll(); // Fetch plants instead of aircraft
        res.status(200).send(plants);
    }

    // Get plant by ID
    async getById(req: Request, res: Response) {
        const { id } = await validateParams(req, IdParam);
        const plant = await productService.getById(id); // Use Plant instead of Aircraft

        if (plant === null) {
            res.status(404).send();
            return;
        }

        res.status(200).send(plant);
    }

    // Create a new plant
    async create(req: Request, res: Response) {
        const dto = await validateBody(req, ProductDto);
        const plant = await productService.create(dto); // Use Plant instead of Aircraft
        res.status(201).send(plant);
    }

    // Update an existing plant
    async update(req: Request, res: Response) {
        const { id } = await validateParams(req, IdParam);
        const dto = await validateBody(req, ProductDto);
        const existingPlant = await productService.getById(id); // Use Plant instead of Aircraft

        if (existingPlant === null) {
            res.status(404).send();
            return;
        }

        const plant = await productService.update(id, dto); // Use Plant instead of Aircraft
        res.status(202).send(plant);
    }

    // Delete a plant
    async delete(req: Request, res: Response) {
        const { id } = await validateParams(req, IdParam);
        await productService.delete(id); // Use Plant instead of Aircraft
        res.status(204).send();
    }
}
