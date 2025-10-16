import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const loginUser = asyncHandler(async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Hardcoded admin credentials
        if (username === "admin" && password === "Admin@admin") {
            // Create a mock user object for token generation
            const mockUser = {
                _id: "admin-user-id",
                username: "admin"
            };
            
            // Generate JWT token manually
            const accessToken = jwt.sign(
                {
                    _id: mockUser._id,
                    username: mockUser.username
                },
                config.accessTokenSecret,
                {
                    expiresIn: config.accessTokenExpire
                }
            );
            
            // Set cookie options
            const options = {
                httpOnly: true,
                secure: config.nodeEnv === "production",
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
            };
            
            // Set cookie and send response
            res.cookie("accessToken", accessToken, options);
            
            return res.status(200).json(new apiResponse(200, {
                user: {
                    _id: mockUser._id,
                    username: mockUser.username
                },
                accessToken
            }, "User logged in successfully"));
        } else {
            return res.status(401).json(new apiError(401, "Invalid username or password"));
        }
    }
    catch(error) {
        return res.status(500).json(new apiError(500, "Internal server error", error.message));
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    try {
        res.clearCookie("accessToken");
        return res.status(200).json(new apiResponse(200, {}, "User logged out successfully"));
    }
    catch(error) {
        return res.status(500).json(new apiError(500, "Internal server error", error.message));
    }
});

// Test endpoint to generate JWT token
const generateTestToken = asyncHandler(async (req, res) => {
    try {
        const payload = {
            _id: "admin-user-id",
            username: "admin"
        };

        const accessToken = jwt.sign(
            payload,
            config.accessTokenSecret,
            {
                expiresIn: config.accessTokenExpire
            }
        );

        return res.status(200).json(new apiResponse(200, {
            token: accessToken,
            payload: payload,
            expiresIn: config.accessTokenExpire
        }, "Test JWT token generated successfully"));
    }
    catch(error) {
        return res.status(500).json(new apiError(500, "Internal server error", error.message));
    }
});

export { loginUser, logoutUser, generateTestToken };