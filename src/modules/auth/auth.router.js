import { Router } from "express";
import { signin, signup } from "./auth.controller.js";
import { signinval, signupval } from "./auth.validate.js";
import { validate } from "../../middleware/validation.js";
import { asyncHandler } from "../../middleware/asynchandler.js";

export const authRouter = Router();
//using async handler
asyncHandler(authRouter)
//sign up with validation 
authRouter.post('/signup', validate(signupval), signup)
//sign in with validation
authRouter.post('/signin', validate(signinval), signin)



// exporting router 
export default authRouter