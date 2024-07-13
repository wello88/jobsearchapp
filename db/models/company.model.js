// schema
import mongoose, { Schema } from "mongoose";
import { employeeRanges } from "../../src/utils/constant.js";

//company schema

const companySchema = new mongoose.Schema({
    companyname:{
        type:String,
        unique: true
    },
    description:String,
    industry:String,
    address:String,
    num_of_employees:{
        type:String,
        enum:employeeRanges
    },
    companyemail: { 
        type: String,
        required: true,
         unique: true
         },
    company_HR: {
         type: Schema.Types.ObjectId,
        ref: 'User',
         required: true
         },
    isVerified: {
        type: String,
        enum: ['true', 'false'],
        default: 'false'
    }
     


},{timestamps: true})


//company model
export const Company = mongoose.model('Company',companySchema);