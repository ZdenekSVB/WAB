import { Request, Response } from "express";
import Tip, { ITip } from "../models/Tip";

export const getTips = async (req: Request, res: Response) => {
    try {
        const tips = await Tip.find();
        res.json(tips);
    } catch (error) {
        res.status(500).json({ message: "Chyba serveru", error: error.message });
    }
};

export const getTipById = async (req: Request, res: Response) => {
    try {
        const tip = await Tip.findById(req.params.id);
        if (!tip) return res.status(404).json({ message: "Tip nenalezen" });
        res.json(tip);
    } catch (error) {
        res.status(500).json({ message: "Chyba serveru", error: error.message });
    }
};

export const createTip = async (req: Request, res: Response) => {
    try {
        const { title, content } = req.body;

        const tip: ITip = new Tip({
            title,
            content,
            createdBy: req.user.id,
        });

        const savedTip = await tip.save();
        res.status(201).json(savedTip);
    } catch (error) {
        res.status(500).json({ message: "Chyba serveru", error: error.message });
    }
};

export const updateTip = async (req: Request, res: Response) => {
    try {
        const updatedTip = await Tip.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTip) return res.status(404).json({ message: "Tip nenalezen" });
        res.json(updatedTip);
    } catch (error) {
        res.status(500).json({ message: "Chyba serveru", error: error.message });
    }
};

export const deleteTip = async (req: Request, res: Response) => {
    try {
        const deletedTip = await Tip.findByIdAndDelete(req.params.id);
        if (!deletedTip) return res.status(404).json({ message: "Tip nenalezen" });
        res.json({ message: "Tip byl smazán" });
    } catch (error) {
        res.status(500).json({ message: "Chyba serveru", error: error.message });
    }
};
