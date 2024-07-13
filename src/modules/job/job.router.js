import { Router } from "express";
import { asyncHandler } from "../../middleware/asynchandler.js";
import { add_job, applyjob, deleteJob, getAllJobs, getJobsByCompany, jobfilter, update_job } from "./job.controller.js";
import { checkAuth } from "../../middleware/check_role.js";
import { auth, protect } from "../../middleware/authentication.js";
import upload from "../../utils/resume.js";


const jobRouter = Router();

asyncHandler(jobRouter)

jobRouter.post('/job', protect , checkAuth ,add_job)
jobRouter.put('/update_job/:jobId', protect , checkAuth ,update_job)
jobRouter.delete('/delete_job/:jobId', protect , checkAuth,deleteJob )
jobRouter.get('/get_all_jobs', protect , checkAuth,getAllJobs )
jobRouter.get('/get_jobs_by_company', protect , checkAuth,getJobsByCompany )
jobRouter.get('/get_job_filter',protect , checkAuth,jobfilter)
jobRouter.post('/apply_job/:jobId',protect ,upload.single('userResume')
,applyjob)
export default jobRouter