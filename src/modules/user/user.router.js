import { Router } from "express";
import {deleteuser, getAccountsByRecoveryEmail, getprofile,getuser,resetpass,updatepassword,updateuser} from "./user.controller.js";
import { validate } from "../../middleware/validation.js";
import { protect } from "../../middleware/authentication.js";
import { get_otp } from "../../utils/sendEmail.js";
import { resetPasswordval, updatePasswordval, updateval } from "./user.validate.js";
import { asyncHandler } from "../../middleware/asynchandler.js";

export const userRouter = Router();
asyncHandler(userRouter)

userRouter.put('/update', protect, validate(updateval),updateuser)
userRouter.delete('/delete', protect, deleteuser)
userRouter.get('/getuser', protect, getuser)
userRouter.get('/getprofile/:userid', getprofile)
userRouter.put('/updatepassword', protect, validate(updatePasswordval),updatepassword)
userRouter.get('/users_by_rec/:recoveryEmail', protect,validate(updateval), getAccountsByRecoveryEmail)
userRouter.post('/get_otp', get_otp)
userRouter.post('/resetpass', validate(resetPasswordval),resetpass)



export default userRouter 