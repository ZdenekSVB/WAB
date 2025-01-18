import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const client = jwksClient({
    jwksUri: "http://localhost:8080/auth/realms/garden-realm/protocol/openid-connect/certs", // JWKS Keycloak
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
    client.getSigningKey(header.kid, (err, key) => {
        const signingKey = key?.getPublicKey();
        callback(err, signingKey);
    });
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        res.status(401).json({ message: "Neautorizovaný přístup, chybí token" });
        return;
    }

    try {
        jwt.verify(
            token,
            getKey,
            {
                audience: "garden-backend",
                issuer: "http://localhost:8080/auth/realms/garden-realm",
            },
            (err, decoded) => {
                if (err) {
                    res.status(401).json({ message: "Neautorizovaný přístup, neplatný token" });
                    return;
                }

                const user = decoded as any;
                req.user = {
                    id: user.sub, // Keycloak ID uživatele
                    role: user.role || "user", // Volitelná role
                    realm_access: user.realm_access, // Přidání rolí
                };

                next();
            }
        );
    } catch (error) {
        res.status(401).json({ message: "Neautorizovaný přístup, neplatný token" });
    }
};
