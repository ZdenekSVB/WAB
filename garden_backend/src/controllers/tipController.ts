import { Request, Response } from "express";
import Tip, { ITip } from "../models/Tip";

// Pomocná funkce pro kontrolu existence uživatele
const getUserId = (req: Request): string => {
    if (req.user && req.user.id) {
        return req.user.id;
    }
    throw new Error("Uživatel není přihlášen");
};

export const getTips = async (req: Request, res: Response): Promise<void> => {
    try {
        const tips = await Tip.find();
        res.json(tips);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Chyba serveru", error: error.message });
        } else {
            res.status(500).json({ message: "Chyba serveru", error: "Neznámá chyba" });
        }
    }
};

export const getTipById = async (req: Request, res: Response): Promise<void> => {
    try {
        const tip = await Tip.findById(req.params.id);
        if (!tip) {
            res.status(404).json({ message: "Tip nenalezen" });
            return;
        }
        res.json(tip);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Chyba serveru", error: error.message });
        } else {
            res.status(500).json({ message: "Chyba serveru", error: "Neznámá chyba" });
        }
    }
};

export const createTip = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, content } = req.body;

        // Kontrola uživatele před přístupem k req.user
        const userId = getUserId(req);

        const tip: ITip = new Tip({
            title,
            content,
            createdBy: userId,
        });

        const savedTip = await tip.save();
        res.status(201).json(savedTip);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Chyba serveru", error: error.message });
        } else {
            res.status(500).json({ message: "Chyba serveru", error: "Neznámá chyba" });
        }
    }
};

export const updateTip = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedTip = await Tip.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTip) {
            res.status(404).json({ message: "Tip nenalezen" });
            return;
        }
        res.json(updatedTip);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Chyba serveru", error: error.message });
        } else {
            res.status(500).json({ message: "Chyba serveru", error: "Neznámá chyba" });
        }
    }
};

export const deleteTip = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedTip = await Tip.findByIdAndDelete(req.params.id);
        if (!deletedTip) {
            res.status(404).json({ message: "Tip nenalezen" });
            return;
        }
        res.json({ message: "Tip byl smazán" });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Chyba serveru", error: error.message });
        } else {
            res.status(500).json({ message: "Chyba serveru", error: "Neznámá chyba" });
        }
    }
};
