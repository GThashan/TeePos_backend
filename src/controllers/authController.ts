import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const generateToken = (id: string): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: "7d"
    });
};


export const register = async (req: Request, res: Response) => {
    try {
        const { name, shopName, phone, pin } = req.body;


        const existing = await User.findOne({ phone });
        if (existing) {
            return res.status(400).json({ message: "Shop already registered" });
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPin = await bcrypt.hash(pin, salt);

        const user = await User.create({
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

    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const login = async (req: Request, res: Response) => {
    try {
        const { phone, pin } = req.body;

        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(404).json({ message: "Invalid Phone Number" });
        }

        const isMatch = await bcrypt.compare(pin, user.pin);

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

    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};