import dotenv from "dotenv";

dotenv.config({
    path: ".env"
});

const config = {
    mongodbUri: process.env.MONGODB_URI,
    dbName: process.env.DB_NAME,
    port: process.env.PORT,
    corsOrigin: process.env.CORS_ORIGIN.split(",").map(o => o.trim()),
    apiBaseUrl: process.env.API_BASE_URL,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    accessTokenExpire: process.env.ACCESS_TOKEN_EXPIRE,
    nodeEnv: process.env.NODE_ENV
};

export default config;
