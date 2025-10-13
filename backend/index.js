import app from "./app.js";
import dotenv from "dotenv";
import config from "./config/config.js";
import connectDB from "./db/index.js";

dotenv.config({
    path: "./env"
})

connectDB();

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
})