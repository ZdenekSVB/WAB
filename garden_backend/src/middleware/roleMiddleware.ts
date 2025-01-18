import {Request, Response, NextFunction} from "express";

// Middleware pro kontrolu role
export const authorize =
    (...roles: string[]) =>
        (req: Request, res: Response, next: NextFunction): void => {
            if (!req.user) {
                res.status(401).json({ message: "Neautorizovaný přístup" });
                return;
            }

            const userRoles = req.user.realm_access?.roles || [];
            if (!roles.some((role) => userRoles.includes(role))) {
                res.status(403).json({ message: "Přístup odepřen: Nedostatečná oprávnění" });
                return;
            }

            next();
        };


export const roleMiddleware = authorize;
