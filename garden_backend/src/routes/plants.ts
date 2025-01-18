import express from "express";
import {
    getPlants,
    getPlantById,
    createPlant,
    updatePlant,
    deletePlant,
} from "../controllers/plantController";
import { protect } from "../middleware/authMiddleware";

/**
 * @swagger
 * /plants:
 *   get:
 *     summary: Získání seznamu rostlin
 *     tags:
 *       - Rostliny
 *     responses:
 *       200:
 *         description: Seznam rostlin
 */

const router = express.Router();

router.get("/", protect, getPlants); // Ověřte, zda je `protect` middleware aplikováno správně
router.get("/:id", protect, getPlantById);
router.post("/", protect, createPlant);
router.put("/:id", protect, updatePlant);
router.delete("/:id", protect, deletePlant);

export default router;
