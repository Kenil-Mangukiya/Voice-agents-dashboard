import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    }
}, {
    timestamps: true
});

// Method to generate access token
userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username
        },
        config.accessTokenSecret,
        {
            expiresIn: config.accessTokenExpire
        }
    );
};

export default mongoose.model("user", userSchema);