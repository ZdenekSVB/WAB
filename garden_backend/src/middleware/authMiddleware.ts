import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token;

    // Získání tokenu z hlavičky
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        res.status(401).json({ message: "Neautorizovaný přístup" });
        return; // Ukončete middleware
    }

    try {
        // Ověření a dekódování tokenu
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

        // Najděte uživatele podle ID
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            res.status(404).json({ message: "Uživatel nenalezen" });
            return; // Ukončete middleware
        }

        // Připojte uživatele k požadavku
        req.user = user as IUser;

        next(); // Pokračujte na další middleware
    } catch (error) {
        const message = error instanceof Error ? error.message : "Chyba při ověřování tokenu";
        res.status(401).json({ message });
    }
};
