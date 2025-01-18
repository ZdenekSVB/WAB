import { Request, Response } from "express";
import Plant, { IPlant } from "../models/Plant";

export const getPlants = async (req: Request, res: Response) => {
    try {
        const plants = await Plant.find();
        res.json(plants);
    } catch (error) {
        res.status(500).json({ message: "Chyba serveru", error: error.message });
    }
};

export const getPlantById = async (req: Request, res: Response) => {
    try {
        const plant = await Plant.findById(req.params.id);
        if (!plant) return res.status(404).json({ message: "Rostlina nenalezena" });
        res.json(plant);
    } catch (error) {
        res.status(500).json({ message: "Chyba serveru", error: error.message });
    }
};

export const createPlant = async (req: Request, res: Response) => {
    try {
        const { name, type, description, imageUrl } = req.body;

        const plant: IPlant = new Plant({
            name,
            type,
            description,
            imageUrl,
            createdBy: req.user.id,
        });

        const savedPlant = await plant.save();
        res.status(201).json(savedPlant);
    } catch (error) {
        res.status(500).json({ message: "Chyba serveru", error: error.message });
    }
};

export const updatePlant = async (req: Request, res: Response) => {
    try {
        const updatedPlant = await Plant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPlant) return res.status(404).json({ message: "Rostlina nenalezena" });
        res.json(updatedPlant);
    } catch (error) {
        res.status(500).json({ message: "Chyba serveru", error: error.message });
    }
};

export const deletePlant = async (req: Request, res: Response) => {
    try {
        const deletedPlant = await Plant.findByIdAndDelete(req.params.id);
        if (!deletedPlant) return res.status(404).json({ message: "Rostlina nenalezena" });
        res.json({ message: "Rostlina byla smazána" });
    } catch (error) {
        res.status(500).json({ message: "Chyba serveru", error: error.message });
    }
};
