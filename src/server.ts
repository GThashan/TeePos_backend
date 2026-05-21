import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";

import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import saleRoutes from "./routes/saleRoutes";

dotenv.config();
connectDB();

const app = express();


const allowedOrigins = [
    "https://tee-pos.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        
        const isAllowed = allowedOrigins.includes(origin) || 
                          origin.endsWith(".vercel.app");
                          
        if (isAllowed) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    credentials: true,
}));


app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", saleRoutes);


app.get("/", (req, res) => {
    res.send("POS API Running");
});


export default app;