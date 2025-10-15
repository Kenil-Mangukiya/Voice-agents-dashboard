import express from "express";
import { getAllCalls, getCallStats } from "../controllers/calls.controller.js";

const router = express.Router();

// GET /api/calls - Get all calls with filtering and pagination
router.get("/", getAllCalls);

// GET /api/calls/stats - Get call statistics
router.get("/stats", getCallStats);

export default router;
