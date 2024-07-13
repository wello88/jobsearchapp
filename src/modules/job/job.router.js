import { Router } from "express";
import { asyncHandler } from "../../middleware/asynchandler.js";
import { add_job, applyjob, deleteJob, getAllJobs, getJobsByCompany, jobfilter, update_job } from "./job.controller.js";
import { checkAuth } from "../../middleware/check_role.js";
import { protect } from "../../middleware/authentication.js";
import upload from "../../utils/resume.js";


const jobRouter = Router();

asyncHandler(jobRouter)
//add job
jobRouter.post('/job', protect, checkAuth, add_job)
// update job
jobRouter.put('/update_job/:jobId', protect, checkAuth, update_job)
// delete job
jobRouter.delete('/delete_job/:jobId', protect, checkAuth, deleteJob)
//get all jobs
jobRouter.get('/get_all_jobs', protect, checkAuth, getAllJobs)
//get jobs by company
jobRouter.get('/get_jobs_by_company', protect, checkAuth, getJobsByCompany)
//filter and get jobs
jobRouter.get('/get_job_filter', protect, checkAuth, jobfilter)
// apply to job
jobRouter.post('/apply_job/:jobId', protect, upload.single('userResume')
    , applyjob)
export default jobRouter