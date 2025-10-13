import mongoose from 'mongoose';
import config from "../config/config.js"

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${config.mongodbUri}/${config.dbName}`);
        console.log(`MongoDB connected: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("fail to connect with MongoDB", error)
        process.exit(1)
    }
}

export default connectDB;