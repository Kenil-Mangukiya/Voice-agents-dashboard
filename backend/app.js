import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import webhookRoute from "./routes/webhook.route.js";
import callsRoute from "./routes/calls.route.js";
import userRoute from "./routes/user.route.js";

const app = express();

app.use(cors({
    origin: config.corsOrigin,
    credentials: true,
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

app.use("/api", webhookRoute);
app.use("/api/calls", callsRoute);
app.use("/api/users", userRoute);

export default app;