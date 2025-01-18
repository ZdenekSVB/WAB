import { Request, Response } from "express";
import User from "../models/User";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Neznámá chyba";
        res.status(500).json({ message: "Chyba serveru", error: message });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404).json({ message: "Uživatel nenalezen" });
            return;
        }
        res.json({ message: "Uživatel byl smazán" });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Neznámá chyba";
        res.status(500).json({ message: "Chyba serveru", error: message });
    }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user?.id);
        if (!user) {
            res.status(404).json({ message: "Uživatel nenalezen" });
            return;
        }
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Neznámá chyba";
        res.status(500).json({ message: "Chyba serveru", error: message });
    }
};
