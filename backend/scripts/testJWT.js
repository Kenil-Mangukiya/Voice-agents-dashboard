import jwt from "jsonwebtoken";
import config from "../config/config.js";

// Test JWT token generation
const testJWT = () => {
    try {
        const payload = {
            _id: "admin-user-id",
            username: "admin"
        };

        const secret = config.accessTokenSecret || "your-secret-key";
        const expiresIn = config.accessTokenExpire || "1d";

        const token = jwt.sign(payload, secret, { expiresIn });
        
        console.log("🔐 JWT Token Generated Successfully!");
        console.log("Token:", token);
        console.log("Secret:", secret);
        console.log("Expires In:", expiresIn);
        
        // Verify the token
        const decoded = jwt.verify(token, secret);
        console.log("✅ Token Verified Successfully!");
        console.log("Decoded Payload:", decoded);
        
    } catch (error) {
        console.error("❌ JWT Error:", error.message);
    }
};

testJWT();
