import mongoose, { Schema } from "mongoose";
import { jobLocations, seniorityLevels, workingTimes } from "../../src/utils/constant.js";
import { Application } from "./application.model.js";

// job schema

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

},{
    timestamps: true})




jobSchema.pre('findOneAndDelete', async function(next)
 {
    const job = this; // Access the job being deleted
    const jobId = job._conditions._id; // Extract job id from conditions
    try {
        // Delete applications related to this job
        await Application.deleteMany({ jobId });
        next(); // Move to the next middleware
    } catch (err) {
        next(err); // Pass any error to the next middleware
    }
});

//job model
export const Job = mongoose.model('Job',jobSchema)