"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dns_1 = __importDefault(require("dns"));
const connectDB = async () => {
    try {
        // Set DNS servers to Google's public DNS to resolve MongoDB Atlas SRV records reliably
        dns_1.default.setServers(["8.8.8.8", "1.1.1.1"]);
        await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    }
    catch (error) {
        console.error("Database connection error:", error);
    }
};
exports.default = connectDB;
