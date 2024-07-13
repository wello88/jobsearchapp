import { AppError } from "../utils/apperror.js";
//asunc handler using APp error class
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => {
            next(new AppError(err.message, err.statusCode));
        });
    };
};



//global error hanler
export const globalErrorHandler = (err, req, res, next) => {
    return res.status(err.statusCode || 500).json({ message: err.message, success: false });
};
