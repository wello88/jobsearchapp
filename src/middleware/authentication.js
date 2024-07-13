import jwt from "jsonwebtoken";
import { AppError } from "../utils/apperror.js";
import { User } from "../../db/models/user.model.js";


//auth authintecation
export const auth = (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {

      return next(new AppError("Unauthorized", 401));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {

        return next(new AppError('Unauthorized', 401));
      } else {
        req.user = decode;

        next();
      }
    });
  } catch (err) {

    next(new AppError('Unauthorized', 401));
  }
};



//protect authintecation to check if user is logged in

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return next(new AppError('Unauthorized', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userid = decoded.userid;

    const user = await User.findById(userid).select('-password');



    if (!user) {
      return next(new AppError('User not found or u do not have permission', 404));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new AppError('Unauthorized', 401));
  }
};




