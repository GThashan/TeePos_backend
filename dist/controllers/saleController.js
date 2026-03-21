"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSalesByDate = exports.createSale = void 0;
const Sale_1 = __importDefault(require("../models/Sale"));
const Product_1 = __importDefault(require("../models/Product"));
const generateReceipt_1 = require("../utils/generateReceipt");
// 🧾 Checkout (Create Sale)
// export const createSale = async (req: any, res: Response) => {
//     try {
//         const { items, paymentMethod } = req.body;
//         let totalAmount = 0;
//         // 🔥 Validate and update stock
//         for (const item of items) {
//             const product = await Product.findById(item.product);
//             if (!product) {
//                 return res.status(404).json({ message: "Product not found" });
//             }
//             if (product.quantity < item.quantity) {
//                 return res.status(400).json({
//                     message: `Not enough stock for ${product.name}`
//                 });
//             }
//             // reduce stock
//             product.quantity -= item.quantity;
//             await product.save();
//             totalAmount += product.price * item.quantity;
//             // update item price (secure)
//             item.price = product.price;
//             item.name = product.name;
//         }
//         const sale = await Sale.create({
//             items,
//             totalAmount,
//             paymentMethod: paymentMethod || "Cash",
//             user: req.user._id
//         });
//         res.status(201).json(sale);
//     } catch (error: any) {
//         res.status(500).json({ message: error.message });
//     }
// };
const createSale = async (req, res) => {
    try {
        const { items, paymentMethod } = req.body;
        let totalAmount = 0;
        for (const item of items) {
            const product = await Product_1.default.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            if (product.quantity < item.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for ${product.name}`
                });
            }
            product.quantity -= item.quantity;
            await product.save();
            totalAmount += product.price * item.quantity;
            item.price = product.price;
            item.name = product.name;
        }
        const sale = await Sale_1.default.create({
            items,
            totalAmount,
            paymentMethod: paymentMethod || "Cash",
            user: req.user._id
        });
        // 🔥 populate user for shop name
        const fullSale = await sale.populate("user");
        // 🔥 generate PDF instead of JSON
        return (0, generateReceipt_1.generateReceipt)(fullSale, res);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createSale = createSale;
const getSalesByDate = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const filter = {
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
        const sales = await Sale_1.default.find(filter).sort({ createdAt: -1 });
        const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
        res.json({
            totalSales: sales.length,
            totalRevenue,
            sales
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getSalesByDate = getSalesByDate;
