import { Router } from "express";
import {asyncHandler} from "../../middleware/asynchandler.js"
import {auth, protect} from "../../middleware/authentication.js"
import { add_company, deletecompany, getapplications, getcompany, searchcompany, updateCompany} from "./compony.controller.js";
import { validate } from "../../middleware/validation.js";
import { companyval, updatecompanyval } from "./company.validate.js";
import { checkAuth } from "../../middleware/check_role.js";

const companyRouter = Router();

asyncHandler(companyRouter)

companyRouter.post('/create', protect , validate(companyval) ,add_company)
companyRouter.put('/update/:userid', protect , validate(updatecompanyval) ,updateCompany)
companyRouter.delete('/delete/:userid', protect ,deletecompany)
companyRouter.get('/getcompany/:companyid', protect ,getcompany)
companyRouter.get('/search/:companyname', protect ,searchcompany)
companyRouter.get('/getapplications/:jobId', protect,checkAuth ,getapplications)




export default companyRouter