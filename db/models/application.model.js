import mongoose, { Schema } from "mongoose";
//applicationschema


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
},{ timestamps: true });
//model
export const Application = mongoose.model('Application', applicationSchema);

