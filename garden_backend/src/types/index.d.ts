import { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        export interface User {
            id: string;
            role: string;
            realm_access?: {
                roles: string[]; // Keycloak `realm_access` obsahuje seznam rolí
            };
        }

        export interface Request {
            user?: User; // Volitelná vlastnost pro uživatele
        }
    }
}
