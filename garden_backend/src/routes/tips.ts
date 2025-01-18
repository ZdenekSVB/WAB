import express from "express";
import {
    getTips,
    getTipById,
    createTip,
    updateTip,
    deleteTip,
} from "../controllers/tipController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", protect, getTips);
router.get("/:id", protect, getTipById);
router.post("/", protect, createTip);
router.put("/:id", protect, updateTip);
router.delete("/:id", protect, deleteTip);

export default router;
