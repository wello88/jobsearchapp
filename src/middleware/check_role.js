import { User } from "../../db/models/user.model.js";
import { AppError } from "../utils/apperror.js";

export const checkAuth = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError('User not authenticated', 401);
        }

        const userid = req.user._id;
        const user = await User.findById(userid);

        if (!user || user.role !== 'company_HR') {
            throw new AppError('Unauthorized to access this route', 403);
        }

        next();
    } catch (error) {
        next(error);
    }
};