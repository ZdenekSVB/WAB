import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Ověření tokenu a nastavení req.user
export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token;

    // Ověření, zda token existuje v hlavičce
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        res.status(401).json({ message: 'Neautorizovaný přístup, chybí token' });
        return; // Ukončení middleware
    }

    try {
        // Ověření tokenu a nastavení req.user
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        req.user = decoded; // Předpokládáme, že decoded obsahuje id uživatele
        next(); // Pokračujte na další middleware/route
    } catch (error) {
        res.status(401).json({ message: 'Neautorizovaný přístup, neplatný token' });
    }
};
