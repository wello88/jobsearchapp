import jwt from 'jsonwebtoken'
import { User } from "../../../db/models/user.model.js"
import { AppError } from "../../utils/apperror.js"
import { sendEmail } from '../../utils/sendEmail.js'
import bcrypt from 'bcrypt'



export const signup = 
    async (req, res, next) => {
        const { error } = User.validate(req.body)
        if (error) {
            return next(new AppError(error.details, 400))
        }
        const { firstname, lastname, email, password, recoveryemail, Dob, mobilenumber, role, status, isVerified } = req.body
        const isExist = await User.findOne({ email })
        if (isExist) {
            return next(new AppError("user already exist", 400))
        }
        const hashedPassword = await bcrypt.hash(password, 8)

        const user = new User({
            firstname,
            lastname,
            username: firstname + lastname,
            email,
            password: hashedPassword,
            recoveryemail,
            Dob,
            mobilenumber,
            role,
            status,
            isVerified: false
        });
        await user.save()
        const token = jwt.sign({ email }, 'secret', { expiresIn: '1h' })
        sendEmail(email, token)
        return res.json({ message: "please check your email", success: true })
    }









export const signin = async (req, res, next) => {
        const { email, recoveryemail, mobilenumber, password } = req.body

        const user = await User.findOne({ $or: [{ email }, { recoveryemail }, { mobilenumber }] })
        if (!user) {
            return next(new AppError("user not found", 404))
        }
        const ismatch = bcrypt.compare(password, user.password)
        if (!ismatch) {
            return next(new AppError("invalid creadintials", 400))
        }
        const isVerified = await User.findOne({
            $or: [
              { email, isVerified: true },
              { recoveryemail, isVerified: true },
              { mobilenumber, isVerified: true }
            ]
          });
      
          if (!isVerified) {
            return next(new AppError('Please verify your email', 400));
          }
        const token = jwt.sign({ email: user.email, userid: user._id,role:user.role }, 'secret', { expiresIn: '1h' })
        user.status = 'online';
        await user.save();

        return res.json({ message: "welcome", success: true, token })
    }