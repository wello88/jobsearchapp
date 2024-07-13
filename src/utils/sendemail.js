// module
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken';
import { htmlTemplate } from './htmlTemplate.js';
import { User } from '../../db/models/user.model.js';
import crypto from 'crypto';
import { asyncHandler } from '../middleware/asynchandler.js';


// function send email
export const sendEmail = async(email,token)=>{ 
    const transporter = nodemailer.createTransport({
    service:process.env.EMAIL_SERVICE,
    auth: {
      user:process.env.EMAIL_USER,
      pass:process.env.EMAIL_PASS
    },
  });

  const info = await transporter.sendMail({
    from: '"job search app" <abdow8896@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Hello ", // Subject line
    text: "Welcome To job search app ", // plain text body
    html: htmlTemplate(token), // html body
  });

}






export const get_otp = asyncHandler(
  async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const otp = crypto.randomBytes(6).toString('hex');
  const otpexpiry = Date.now() + 10 * 60 * 1000; 

  user.resetotp = otp;
  user.otpexpiry = otpexpiry;
  await user.save();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "abdow8896@gmail.com",
      pass: "bcgvxojiotrgyfwa",
  },
  });

  const mailOptions = {
      from: '"job search app" <abdow8896@gmail.com>', 
      to: user.email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return next(new AppError('Error sending OTP email', 500));
    } else {
      res.status(200).json({ message: 'OTP sent to your email', success: true });
    }
  });
});