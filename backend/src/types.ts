import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
    user?: {
        _id: string;
        email: string;
        token: string; // Ensure this property is included
    };
}