import { Plant } from "../persistence/models/product.model";
import { ProductDto } from "../api/controllers/product/product.dto";

export const productService = {
    // Create a new plant product
    async create(data: ProductDto) {
        const plant = new Plant(data); // Use Plant instead of Aircraft
        await plant.save();
        return plant;
    },

    // Get all plant products
    async getAll() {
        return Plant.find(); // Use Plant instead of Aircraft
    },

    // Get a plant product by its ID
    async getById(id: string) {
        return Plant.findById(id); // Use Plant instead of Aircraft
    },

    // Update a plant product
    async update(id: string, data: ProductDto) {
        return Plant.findByIdAndUpdate(id, data, { new: true }); // Use Plant instead of Aircraft
    },

    // Delete a plant product
    async delete(id: string) {
        return Plant.findByIdAndDelete(id); // Use Plant instead of Aircraft
    },
};
