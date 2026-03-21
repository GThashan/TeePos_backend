"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const saleController_1 = require("../controllers/saleController");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.default, saleController_1.createSale);
router.get("/", authMiddleware_1.default, saleController_1.getSalesByDate);
exports.default = router;
