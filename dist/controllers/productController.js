"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProducts = exports.addProduct = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const addProduct = async (req, res) => {
    try {
        const { name, category, price, quantity } = req.body;
        const product = await Product_1.default.create({
            name,
            category,
            price,
            quantity,
            user: req.user._id
        });
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.addProduct = addProduct;
const getProducts = async (req, res) => {
    try {
        const products = await Product_1.default.find({ user: req.user._id });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getProducts = getProducts;
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product_1.default.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (product.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }
        const updated = await Product_1.default.findByIdAndUpdate(id, req.body, {
            new: true
        });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product_1.default.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (product.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }
        await product.deleteOne();
        res.json({ message: "Product deleted" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteProduct = deleteProduct;
