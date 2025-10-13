const config = {
    mongodbUri : process.env.MONGODB_URI,
    dbName : process.env.DB_NAME,
    port : process.env.PORT,
    corsOrigin : process.env.CORS_ORIGIN
}

export default config