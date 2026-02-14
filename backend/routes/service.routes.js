import express from "express";
import serviceController from "../controllers/service.controller.js";

const router = express.Router();

// GET /api/services/by-zip/:zip
router.get("/by-zip/:zip", serviceController.getServicesByZip);

export default router;
