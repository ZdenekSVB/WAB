import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import jwt from "jsonwebtoken";

// Registrace uživatele
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: "Email již existuje" });
            return;
        }

        const newUser: IUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({ message: "Uživatel registrován" });
    } catch (error) {
        res.status(500).json({ message: "Chyba serveru", error: error instanceof Error ? error.message : "Neznámá chyba" });
    }
};

// Přihlášení uživatele
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "Uživatel nenalezen" });
            return;
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ message: "Špatné heslo" });
            return;
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        res.status(200).json({ message: "Přihlášení úspěšné", token });
    } catch (error) {
        res.status(500).json({ message: "Chyba serveru", error: error instanceof Error ? error.message : "Neznámá chyba" });
    }
};
