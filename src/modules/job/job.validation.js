import joi from "joi";
//job validation
export const jobval = joi.object({
    jobtitle: joi.string().required(),
    jobLocation: joi.string().required(),
    workingTime: joi.string().required(),
    seniorityLevel: joi.string().required(),
    jobDescription: joi.string().required(),
    technicalSkills: joi.string().required(),
    softSkills: joi.string().required(),
    addedBy: joi.string().required(),

})



//update data validation
export const updatejobval = joi.object({
    jobtitle: joi.string(),
    jobLocation: joi.string(),
    workingTime: joi.string(),
    seniorityLevel: joi.string(),
    jobDescription: joi.string(),
    technicalSkills: joi.string(),
    softSkills: joi.string(),
    addedBy: joi.string(),

})