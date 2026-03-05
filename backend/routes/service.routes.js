import express from "express";
import serviceController from "../controllers/service.controller.js";

const router = express.Router();

// GET /api/services/zip-info - Get zip code information (zip, city, county)
router.post("/zip-info", serviceController.getZipCodeInfo);

// GET /api/services/by-zip
router.post("/by-zip", serviceController.getServicesByZip);

export default router;
