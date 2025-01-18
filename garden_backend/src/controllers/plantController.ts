import { Request, Response } from "express";
import Plant, { IPlant } from "../models/Plant";

// Získání všech rostlin
export const getPlants = async (req: Request, res: Response): Promise<void> => {
    try {
        const plants = await Plant.find();
        res.json(plants); // Poslání odpovědi bez návratu
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Chyba serveru", error: error.message });
        } else {
            res.status(500).json({ message: "Chyba serveru", error: "Neznámá chyba" });
        }
    }
};

// Získání rostliny podle ID
export const getPlantById = async (req: Request, res: Response): Promise<void> => {
    try {
        const plant = await Plant.findById(req.params.id);
        if (!plant) {
            res.status(404).json({ message: "Rostlina nenalezena" });
            return;
        }
        res.json(plant);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Chyba serveru", error: error.message });
        } else {
            res.status(500).json({ message: "Chyba serveru", error: "Neznámá chyba" });
        }
    }
};

// Vytvoření nové rostliny
export const createPlant = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, type, description, imageUrl } = req.body;

        if (!req.user) {
            res.status(401).json({ message: "Neautorizovaný přístup" });
            return;
        }

        const plant = new Plant({
            name,
            type,
            description,
            imageUrl,
            createdBy: req.user.id, // Typ je nyní jistý
        });

        const savedPlant = await plant.save();
        res.status(201).json(savedPlant);
    } catch (error) {
        res.status(500).json({ message: "Chyba serveru", error: error instanceof Error ? error.message : "Neznámá chyba" });
    }
};


// Aktualizace rostliny
export const updatePlant = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedPlant = await Plant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPlant) {
            res.status(404).json({ message: "Rostlina nenalezena" });
            return;
        }
        res.json(updatedPlant);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Chyba serveru", error: error.message });
        } else {
            res.status(500).json({ message: "Chyba serveru", error: "Neznámá chyba" });
        }
    }
};

// Smazání rostliny
export const deletePlant = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedPlant = await Plant.findByIdAndDelete(req.params.id);
        if (!deletedPlant) {
            res.status(404).json({ message: "Rostlina nenalezena" });
            return;
        }
        res.json({ message: "Rostlina byla smazána" });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Chyba serveru", error: error.message });
        } else {
            res.status(500).json({ message: "Chyba serveru", error: "Neznámá chyba" });
        }
    }
};
