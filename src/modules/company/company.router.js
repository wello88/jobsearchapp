import { Router } from "express";
import { asyncHandler } from "../../middleware/asynchandler.js"
import { auth, protect } from "../../middleware/authentication.js"
import { add_company, deletecompany, getapplications, getApplicationsByCompanyAndDate, getcompany, searchcompany, updateCompany } from "./compony.controller.js";
import { validate } from "../../middleware/validation.js";
import { companyval, updatecompanyval } from "./company.validate.js";
import { checkAuth } from "../../middleware/check_role.js";

const companyRouter = Router();
// using async handler
asyncHandler(companyRouter)
// add company as hr user and using validation and authentication
companyRouter.post('/create', protect, validate(companyval), add_company)
//update company using validation and authentication
companyRouter.put('/update/:userid', protect, validate(updatecompanyval), updateCompany)
//delete company 
companyRouter.delete('/delete', protect, checkAuth, deletecompany)
//get company by id
companyRouter.get('/getcompany/:companyid', protect, getcompany)
//search company by name
companyRouter.get('/search/:companyname', protect, searchcompany)
//get company applications
companyRouter.get('/getapplications/:jobId', protect, checkAuth, getapplications)
// get company application in excel
companyRouter.get('/getapp-excel/:companyid/app', protect, checkAuth, getApplicationsByCompanyAndDate);

//exporting router


export default companyRouter