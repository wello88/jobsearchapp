import { AppError } from "../utils/apperror.js";

export const validate = (schema) => {
    return (req, res, next)=>{
        const {error} = schema.validate(req.body,{abortEarly:false})
        if(error){
            const errorarray = error.details.map(ele => ele.message)
            req.errorarray = errorarray
            return next(new AppError(errorarray, 401))
        }
    next()
    }
    }