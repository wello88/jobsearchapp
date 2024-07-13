import { Router } from "express";
import { deleteuser, getAccountsByRecoveryEmail, getprofile, getuser, resetpass, updatepassword, updateuser } from "./user.controller.js";
import { validate } from "../../middleware/validation.js";
import { protect } from "../../middleware/authentication.js";
import { get_otp } from "../../utils/sendEmail.js";
import { resetPasswordval, updatePasswordval, updateval } from "./user.validate.js";
import { asyncHandler } from "../../middleware/asynchandler.js";

export const userRouter = Router();
//using async handler
asyncHandler(userRouter)
//update user
userRouter.put('/update', protect, validate(updateval), updateuser)
//delete user
userRouter.delete('/deleteuser', protect, deleteuser)
//get user
userRouter.get('/getuser', protect, getuser)
//get profile
userRouter.get('/getprofile/:userid', getprofile)
//update password
userRouter.put('/updatepassword', protect, validate(updatePasswordval), updatepassword)
//get accounts by recovery email
userRouter.get('/users_by_rec/:recoveryEmail', protect, validate(updateval), getAccountsByRecoveryEmail)
//get otp
userRouter.post('/get_otp', get_otp)
//reset password
userRouter.post('/resetpass', validate(resetPasswordval), resetpass)

//exporting router

export default userRouter 