import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    shopName: string;
    phone: string;
    pin: string;
}

const userSchema: Schema<IUser> = new Schema(
    {
        name: { type: String, required: true },
        shopName: { type: String, required: true },
        phone: { type: String, required: true, unique: true },
        pin: { type: String, required: true }
    },
    { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);