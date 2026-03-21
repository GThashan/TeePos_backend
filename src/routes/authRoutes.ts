import express from "express";
import { register, login, resetPin } from "../controllers/authController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/reset-pin", resetPin);

export default router;