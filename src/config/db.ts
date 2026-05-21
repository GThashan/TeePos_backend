import mongoose from "mongoose";
import dns from "dns";

const connectDB = async (): Promise<void> => {
    try {
        // Set DNS servers to Google's public DNS to resolve MongoDB Atlas SRV records reliably
        dns.setServers(["8.8.8.8", "1.1.1.1"]);
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

export default connectDB;