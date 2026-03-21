import mongoose, { Document, Schema } from "mongoose";

interface IItem {
    product: mongoose.Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
}

export interface ISale extends Document {
    items: IItem[];
    totalAmount: number;
    paymentMethod: "Cash"; // later add Card
    user: mongoose.Types.ObjectId;
}

const saleSchema: Schema<ISale> = new Schema(
    {
        items: [
            {
                product: { type: Schema.Types.ObjectId, ref: "Product" },
                name: String,
                price: Number,
                quantity: Number
            }
        ],
        totalAmount: { type: Number, required: true },
        paymentMethod: {
            type: String,
            enum: ["Cash"],
            default: "Cash"
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

export default mongoose.model<ISale>("Sale", saleSchema);