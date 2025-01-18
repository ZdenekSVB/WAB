import express from "express";
import { registerUser, loginUser } from "../controllers/authController";
import { getUsers, deleteUser } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrace nového uživatele
 *     tags:
 *       - Autentizace
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Uživatel byl úspěšně registrován
 *       400:
 *         description: Chyba při registraci
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Přihlášení uživatele
 *     tags:
 *       - Autentizace
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Přihlášení bylo úspěšné
 *       401:
 *         description: Neplatné přihlašovací údaje
 */


const router = express.Router();

// Registrace a přihlášení
router.post("/register", registerUser);
router.post("/login", loginUser);

// Správa uživatelů (admin only)
router.get("/users", protect, roleMiddleware("admin"), getUsers);
router.delete("/users/:id", protect, roleMiddleware("admin"), deleteUser);

// Získání aktuálního uživatele
router.get("/me", protect, (req, res) => {
    res.json(req.user);
});

export default router;
