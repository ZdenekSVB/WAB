import { Request, Response } from "express";
import User from "../models/User";

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Chyba serveru", error });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404).json({ message: "Uživatel nenalezen" });
            return;
        }
        res.json({ message: "Uživatel byl smazán" });
    } catch (error) {
        res.status(500).json({ message: "Chyba serveru", error });
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
        res.status(500).json({ message: "Chyba serveru", error: error instanceof Error ? error.message : "Neznámá chyba" });
    }
};
