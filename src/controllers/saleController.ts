import { Request, Response } from "express";
import Sale from "../models/Sale";
import Product from "../models/Product";

// 🧾 Checkout (Create Sale)
export const createSale = async (req: any, res: Response) => {
    try {
        const { items, paymentMethod } = req.body;

        let totalAmount = 0;

        // 🔥 Validate and update stock
        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            if (product.quantity < item.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for ${product.name}`
                });
            }

            // reduce stock
            product.quantity -= item.quantity;
            await product.save();

            totalAmount += product.price * item.quantity;

            // update item price (secure)
            item.price = product.price;
            item.name = product.name;
        }

        const sale = await Sale.create({
            items,
            totalAmount,
            paymentMethod: paymentMethod || "Cash",
            user: req.user._id
        });

        res.status(201).json(sale);

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


export const getSalesByDate = async (req: any, res: Response) => {
    try {
        const { startDate, endDate } = req.query;

        const filter: any = {
            user: req.user._id
        };

        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            // 🔥 fix: include full day
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);

            filter.createdAt = {
                $gte: start,
                $lte: end
            };
        }

        const sales = await Sale.find(filter).sort({ createdAt: -1 });

        const totalRevenue = sales.reduce(
            (sum, sale) => sum + sale.totalAmount,
            0
        );

        res.json({
            totalSales: sales.length,
            totalRevenue,
            sales
        });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};