const config = {
    mongodbUri : process.env.MONGODB_URI,
    dbName : process.env.DB_NAME,
    port : process.env.PORT,
    corsOrigin : process.env.CORS_ORIGIN,
    apiBaseUrl : process.env.API_BASE_URL
}

export default config