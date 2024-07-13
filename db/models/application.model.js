import mongoose, { Schema } from "mongoose";



export const applicationSchema = new Schema({
    jobId: {
        type: Schema.Types.ObjectId,
        ref: 'Job', required: true
    },
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'User',    
        required: true
    },
    userTechSkills: {
        type: [String],
        required: true
    },
    userSoftSkills: {
        type: [String],
        required: true
    },
    userResume: {
        type: String,
        required: true
    } // URL Cloudinary
});

export const Application = mongoose.model('Application', applicationSchema);

