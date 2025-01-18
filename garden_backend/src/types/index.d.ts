import { JwtPayload } from "jsonwebtoken";
import { IUser } from "../models/User";

declare global {
    namespace Express {
        interface User {
            id: string;
            role: string;
        }

        interface Request {
            user?: IUser; // Volitelný uživatel
        }
    }
}
