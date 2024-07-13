import mongoose, { Schema } from "mongoose";
import { jobLocations, seniorityLevels, workingTimes } from "../../src/utils/constant.js";


const jobSchema = new mongoose.Schema({

    jobtitle: String,
    jobLocation: {
        type: String,
        enum: jobLocations,
        required: true
    },
    workingTime: {
        type: String,
        enum: workingTimes,
        required: true
    },
    seniorityLevel: {
        type: String,
        enum: seniorityLevels,
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    technicalSkills: {
        type: [String],
        required: true
    },
    softSkills: {
        type: [String],
        required: true
    },
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    companyid: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    }

})

export const Job = mongoose.model('Job',jobSchema)