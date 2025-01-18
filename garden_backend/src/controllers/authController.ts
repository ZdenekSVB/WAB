import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import jwt from "jsonwebtoken";

// Registrace uživatele
export const registerUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "Email již existuje" });

        const newUser: IUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({ message: "Uživatel registrován" });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Chyba serveru", error: error.message });
        } else {
            res.status(500).json({ message: "Chyba serveru", error: "Neznámá chyba" });
        }
    }
};

// Přihlášení uživatele
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Uživatel nenalezen" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: "Špatné heslo" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
        res.json({ message: "Přihlášení úspěšné", token });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Chyba serveru", error: error.message });
        } else {
            res.status(500).json({ message: "Chyba serveru", error: "Neznámá chyba" });
        }
    }
};
