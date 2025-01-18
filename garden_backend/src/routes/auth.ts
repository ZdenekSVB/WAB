import express, { Request, Response } from "express";
import { registerUser, loginUser } from "../controllers/authController";

const router = express.Router();

// Definování rout pro registraci a přihlášení
router.post("/register", async (req: Request, res: Response) => {
    try {
        await registerUser(req, res);
    } catch (error) {
        res.status(500).json({ message: "Chyba serveru při registraci" });
    }
});

router.post("/login", async (req: Request, res: Response) => {
    try {
        await loginUser(req, res);
    } catch (error) {
        res.status(500).json({ message: "Chyba serveru při přihlášení" });
    }
});

export default router;
