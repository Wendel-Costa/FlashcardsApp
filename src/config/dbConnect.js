import "dotenv/config"
import mongoose from "mongoose";

async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.DB_CONEXAO_STRING, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log("Connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
    return mongoose.connection;
}

export default connectToDatabase;