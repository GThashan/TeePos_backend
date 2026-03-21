import { Request, Response } from "express";
import Product from "../models/Product";


export const addProduct = async (req: any, res: Response) => {
    try {
        const { name, category, price, quantity } = req.body;

        const product = await Product.create({
            name,
            category,
            price,
            quantity,
            user: req.user._id
        });

        res.status(201).json(product);

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


export const getProducts = async (req: any, res: Response) => {
    try {
        const products = await Product.find({ user: req.user._id });

        res.json(products);

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


export const updateProduct = async (req: any, res: Response) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }


        if (product.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const updated = await Product.findByIdAndUpdate(id, req.body, {
            new: true
        });

        res.json(updated);

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteProduct = async (req: any, res: Response) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }

        await product.deleteOne();

        res.json({ message: "Product deleted" });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};