import mongoose from "mongoose";
import { roles } from "../../src/utils/constant.js";
//user schema
const userschema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
      email: {
        type:String,
        unique: true
    },
    password: String,
    recoveryemail: String,
    Dob: Date,
    mobilenumber: {
        type:String,
        unique: true    
    },
    role: {type:String,
        enum:roles
    },
    status: {
        type:String,
        enum: ['online', 'offline'],
        default: 'offline'
    },
    isVerified: Boolean,
    resetotp: String,
    otpexpiry: Date,
})

//user model


export const User = mongoose.model('User',userschema)