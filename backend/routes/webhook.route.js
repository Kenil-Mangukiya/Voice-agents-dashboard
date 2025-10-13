import express from "express";
import webhook from "../controllers/webhook.controller.js";

const router = express.Router();

router.post("/webhook", webhook);

export default router;
