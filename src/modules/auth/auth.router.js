import { Router } from "express";
import { signin, signup} from "./auth.controller.js";
import { signinval, signupval } from "./auth.validate.js";
import { validate } from "../../middleware/validation.js";
import { asyncHandler } from "../../middleware/asynchandler.js";

export const authRouter = Router();
asyncHandler(authRouter)

authRouter.post('/signup', validate(signupval),signup)
authRouter.post('/signin', validate(signinval), signin)




export default authRouter