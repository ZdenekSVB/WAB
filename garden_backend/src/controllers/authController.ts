import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import jwt from "jsonwebtoken";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: "Email already exists" });
            return;
        }

        const newUser: IUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({ message: "User registered" });
    } catch (error) {
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        res.status(500).json({ message: "Server error", error: message });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid password" });
            return;
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
            expiresIn: "1d",
        });

        res.status(200).json({ token });
    } catch (error) {
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        res.status(500).json({ message: "Server error", error: message });
    }
};
