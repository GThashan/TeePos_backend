import express from "express";
import protect from "../middleware/authMiddleware";
import { createSale, getSalesByDate } from "../controllers/saleController";

const router = express.Router();

router.post("/", protect, createSale);
router.get("/", protect, getSalesByDate);

export default router;