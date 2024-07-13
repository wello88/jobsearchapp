import express from 'express'
import { connectDB } from './db/connection.js'
import { authRouter } from './src/modules/auth/auth.router.js'
import { asyncHandler, globalErrorHandler } from './src/middleware/asynchandler.js'
import companyRouter from './src/modules/company/company.router.js'
import userRouter from './src/modules/user/user.router.js'
import { User } from './db/models/user.model.js'
import { Company } from './db/models/company.model.js'
import jwt from 'jsonwebtoken'
import { AppError } from './src/utils/apperror.js'
import jobRouter from './src/modules/job/job.router.js'

const app = express()
const port  = 3000

connectDB()

app.use(express.json());

app.use('/',authRouter)
app.use('/',companyRouter)
app.use('/',userRouter)
app.use('/',jobRouter)


app.use('/verify/:token', asyncHandler(async (req, res, next) => {
    const {token} = req.params
    const payload = jwt.verify(token, 'secret'); 

    if (payload.email) {
        const user = await User.findOneAndUpdate({ email: payload.email }, { isVerified: true });
        if (!user) {
            return next(new AppError('Invalid token or email', 401));
        }
        return res.json({ message: 'Your email has been verified. You can now log in.', success: true });
    }

    if (payload.companyemail) {
        const company = await Company.findOneAndUpdate({ companyemail: payload.companyemail }, { isVerified: true });
        if (!company) {
            return next(new AppError('Failed to verify company email', 500));
        }
        return res.json({ message: 'The company email has been verified.', success: true });
    }

    return next(new AppError('Invalid token payload', 400));
}));




app.use(globalErrorHandler)

app.listen(port, () => console.log('listening on port',port))