import { Router } from "express";
import {asyncHandler} from "../../middleware/asynchandler.js"
import {auth, protect} from "../../middleware/authentication.js"
import { add_company, deletecompany, getapplications, getApplicationsByCompanyAndDate, getcompany, searchcompany, updateCompany} from "./compony.controller.js";
import { validate } from "../../middleware/validation.js";
import { companyval, updatecompanyval } from "./company.validate.js";
import { checkAuth } from "../../middleware/check_role.js";

const companyRouter = Router();

asyncHandler(companyRouter)

companyRouter.post('/create', protect , validate(companyval) ,add_company)
companyRouter.put('/update/:userid', protect , validate(updatecompanyval) ,updateCompany)
companyRouter.delete('/delete', protect, checkAuth ,deletecompany)
companyRouter.get('/getcompany/:companyid', protect ,getcompany)
companyRouter.get('/search/:companyname', protect ,searchcompany)
companyRouter.get('/getapplications/:jobId', protect,checkAuth ,getapplications)
// get company application in excel
companyRouter.get('/getapp-excel/:companyid/app', protect,checkAuth,getApplicationsByCompanyAndDate);




export default companyRouter