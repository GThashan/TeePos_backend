"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPin = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
};
const register = async (req, res) => {
    try {
        const { name, shopName, phone, pin } = req.body;
        const existing = await User_1.default.findOne({ phone });
        if (existing) {
            return res.status(400).json({ message: "Shop already registered" });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPin = await bcryptjs_1.default.hash(pin, salt);
        const user = await User_1.default.create({
            name,
            shopName,
            phone,
            pin: hashedPin
        });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            shopName: user.shopName,
            phone: user.phone,
            token: generateToken(user._id.toString()),
            message: "Shop registered successfully",
            success: true
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { phone, pin } = req.body;
        const user = await User_1.default.findOne({ phone });
        if (!user) {
            return res.status(404).json({ message: "Invalid Phone Number" });
        }
        const isMatch = await bcryptjs_1.default.compare(pin, user.pin);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid PIN" });
        }
        res.json({
            _id: user._id,
            name: user.name,
            shopName: user.shopName,
            phone: user.phone,
            token: generateToken(user._id.toString()),
            message: "Login successful",
            success: true
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.login = login;
const resetPin = async (req, res) => {
    try {
        const { phone, newPin } = req.body;
        const user = await User_1.default.findOne({ phone });
        if (!user) {
            return res.status(404).json({ message: "Shop not found" });
        }
        if (!newPin || newPin.length !== 6) {
            return res.status(400).json({ message: "PIN must be 6 digits" });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPin = await bcryptjs_1.default.hash(newPin, salt);
        user.pin = hashedPin;
        await user.save();
        res.json({ message: "PIN reset successful" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.resetPin = resetPin;
