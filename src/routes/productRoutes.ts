import express from "express";
import protect from "../middleware/authMiddleware";
import {
    addProduct,
    getProducts,
    updateProduct,
    deleteProduct
} from "../controllers/productController";

const router = express.Router();

router.post("/", protect, addProduct);
router.get("/", protect, getProducts);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;