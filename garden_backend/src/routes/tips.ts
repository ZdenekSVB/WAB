import express from "express";
import {
    getTips,
    getTipById,
    createTip,
    updateTip,
    deleteTip,
} from "../controllers/tipController";
import { protect } from "../middleware/authMiddleware";
/**
 * @swagger
 * /tips:
 *   get:
 *     summary: Získání seznamu tipů
 *     tags:
 *       - Tipy
 *     responses:
 *       200:
 *         description: Seznam tipů
 */

const router = express.Router();

// Použití protect middleware pro ochranu endpointů
router.get("/", protect, getTips);
router.get("/:id", protect, getTipById);
router.post("/", protect, createTip);
router.put("/:id", protect, updateTip);
router.delete("/:id", protect, deleteTip);

export default router;
