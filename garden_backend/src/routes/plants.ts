import express from "express";
import {
    getPlants,
    getPlantById,
    createPlant,
    updatePlant,
    deletePlant,
} from "../controllers/plantController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", protect, getPlants);
router.get("/:id", protect, getPlantById);
router.post("/", protect, createPlant);
router.put("/:id", protect, updatePlant);
router.delete("/:id", protect, deletePlant);

export default router;
