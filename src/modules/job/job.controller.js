import { Application } from "../../../db/models/application.model.js";
import { Company } from "../../../db/models/company.model.js"
import { Job } from "../../../db/models/job.model.js"
import { User } from "../../../db/models/user.model.js";
import { AppError } from "../../utils/apperror.js"
import {cloudinary} from '../../utils/cloud.js';
import multer from 'multer';


//add job api
export const add_job = async (req, res, next) => {
    //distruct userid
    const userid = req.user._id; 

    //check if user is company_HR
    
    const company = await Company.findOne({ company_HR: userid });
    if (!company) {
        return next(new AppError('Company not found', 404));
    }
    
    //distruct data from req.body
    const { jobtitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills } = req.body;
    const job = new Job({
        jobtitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
        addedBy: userid,
        companyid: company._id
    });
//save job
    const addjob = await job.save();
    if (!addjob) {
        return next(new AppError('Job not added', 401));
    }

    return res.status(200).json({ message: 'Job added successfully', success: true, data: addjob });

};




//update job
export const update_job = async (req, res, next) => {
//distruct userid
    const userid = req.user._id;
    //distruct jobid from params
    const { jobId } = req.params;
//distruct data from req.body
    const { jobtitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills } = req.body;
//find by id and update    
    const job = await Job.findByIdAndUpdate(
        { _id: jobId },
        { jobtitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills },
        { new: true }
    )
    return res.status(200).json({ message: 'Job updated successfully', success: true, data: job });
}


export const deleteJob = async (req, res, next) => {
    const userid = req.user._id;
    const { jobId } = req.params;

    // Find the job
    const job = await Job.findOne({ _id: jobId, addedBy: userid });
    if (!job) {
        return next(new AppError('Job does not exist or user not authorized to delete', 404));
    }

    // Delete job
    await Job.findByIdAndDelete(jobId);

    return res.status(200).json({ message: 'Job deleted successfully', success: true });
}; 



// Get all Jobs with their company's information
export const getAllJobs = async (req, res, next) => {
    const jobs = await Job.find().populate('companyid');

    return res.status(200).json({ message: 'Jobs fetched successfully', success: true, data: jobs });
};




// Get all Jobs for a specific company
export const getJobsByCompany = async (req, res, next) => {
    const { companyname } = req.query;

    const company = await Company.findOne({ companyname });
    if (!company) {
        return next(new AppError('Company does not exist', 404));
    }

    const jobs = await Job.find({ addedBy: company.company_HR });

    return res.status(200).json({ message: 'Jobs fetched successfully', success: true, data: jobs });
};



//get all gobs by filter 

export const jobfilter = async (req, res, next) => {

    const { jobtitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills } = req.query;
    let filter = {}

    if (jobtitle) {
        filter.jobtitle = jobtitle
    }
    if (jobLocation) {
        filter.jobLocation = jobLocation
    }
    if (workingTime) {
        filter.workingTime = workingTime
    }
    if (seniorityLevel) {
        filter.seniorityLevel = seniorityLevel
    }
    if (jobDescription) {
        filter.jobDescription = jobDescription
    }
    if (technicalSkills) {
        filter.technicalSkills = technicalSkills
    }
    if (softSkills) {
        filter.softSkills = softSkills
    }

    const jobs = await Job.find(filter);
    if (!jobs) {
        return next(new AppError('Jobs not found', 404));
    }
    return res.status(200).json({ message: 'Jobs fetched successfully', success: true, data: jobs});

}








export const applyjob = async (req,res,next)=>{
    // distruct userid
    const userid = req.user._id;
    const {jobId} = req.params
    //distruct data from req.body
    const {userTechSkills,userSoftSkills, userResume} = req.body

    const job = await Job.findById(jobId);
    if(!job){
        return next(new AppError('Job not found', 404));
    }

    const user = await User.findById(userid);
    if (!user || user.role !== 'user') {
        throw new AppError('Unauthorized to access this route', 403);
    }
    
    // Check if file is uploaded
    const file = req.file;
    console.log(req.file);
    if (!file) {
      return next(new AppError("No file uploaded", 400));
    }

  

    const apply = await Application.create({
        jobId,
        userid: userid,
        userTechSkills: userTechSkills.split(','),
        userSoftSkills:userSoftSkills.split(','),
        userResume: file.path, 
    })
    const createdapplication = await apply.save();
    if(!createdapplication){
        return next(new AppError('Application not created', 401));
    }
    return res.status(200).json({ message: 'Application created successfully', success: true, data: createdapplication });


}