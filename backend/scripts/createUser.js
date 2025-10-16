import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const createTestUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/voice-agent-dashboard");
        console.log("Connected to MongoDB");

        // Check if user already exists
        const existingUser = await User.findOne({ username: "admin" });
        if (existingUser) {
            console.log("User 'admin' already exists");
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash("password", 10);

        // Create user
        const user = new User({
            username: "admin",
            password: hashedPassword
        });

        await user.save();
        console.log("Test user created successfully:");
        console.log("Username: admin");
        console.log("Password: password");
    } catch (error) {
        console.error("Error creating user:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
};

createTestUser();
