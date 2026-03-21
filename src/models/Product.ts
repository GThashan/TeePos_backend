import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
    name: string;
    category: "Men" | "Women" | "Kids" | "Unisex";
    price: number;
    quantity: number;
    user: mongoose.Types.ObjectId;
}

const productSchema: Schema<IProduct> = new Schema(
    {
        name: { type: String, required: true },
        category: {
            type: String,
            enum: ["Men", "Women", "Kids", "Unisex"],
            required: true
        },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 0 },

        // link to shop owner
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

export default mongoose.model<IProduct>("Product", productSchema);