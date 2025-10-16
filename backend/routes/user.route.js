import express from "express";
import { loginUser, logoutUser, generateTestToken } from "../controllers/user.controller.js";

const router = express.Router();

// User authentication routes
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Test route to generate JWT token
router.get("/test-token", generateTestToken);

export default router;
