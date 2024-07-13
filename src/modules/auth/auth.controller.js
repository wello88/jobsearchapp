import jwt from 'jsonwebtoken'
import { User } from "../../../db/models/user.model.js"
import { AppError } from "../../utils/apperror.js"
import { sendEmail } from '../../utils/sendEmail.js'
import bcrypt from 'bcrypt'


//sign up using email verification & send email from utils
export const signup =
    async (req, res, next) => {
        const { error } = User.validate(req.body)
        if (error) {
            return next(new AppError(error.details, 400))
        }
        //distruct useer data
        const { firstname, lastname, email, password, recoveryemail, Dob, mobilenumber, role, status, isVerified } = req.body
        // check email existance
        const isExist = await User.findOne({ email })
        if (isExist) {
            return next(new AppError("user already exist", 400))
        }
        //passsword hashing
        const hashedPassword = await bcrypt.hash(password, 8)
        //prepare data

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
        //save data to db
        await user.save()
        // genrate token and send email
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' })
        sendEmail(email, token)
        return res.json({ message: "please check your email", success: true })
    }








//sign in 
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
    //check of user verify his account

    if (!isVerified) {
        return next(new AppError('Please verify your email', 400));
    }
    //genrate token
    const token = jwt.sign({ email: user.email, userid: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' })
    user.status = 'online';
    await user.save();

    return res.json({ message: "welcome", success: true, token })
}