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


app.use(cors({
    origin: process.env.NODE_ENV === "production"
        ? "https://tee-pos.vercel.app"
        : "*",
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