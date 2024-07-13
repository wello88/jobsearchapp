import { User } from "../../db/models/user.model.js";
import { AppError } from "../utils/apperror.js";

//middleware to check the role of the user logged in
export const checkAuth = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError('User not authenticated', 401);
        }
        //distruct userid
        const userid = req.user._id;
        const user = await User.findById(userid);
        //check on the role if it is company HR or not
        if (!user || user.role !== 'company_HR') {
            throw new AppError('Unauthorized to access this route', 403);
        }

        next();
    } catch (error) {
        next(error);
    }
};