import { asyncHandler } from "../../middleware/asynchandler.js"
import { User } from "../../../db/models/user.model.js"
import { AppError } from "../../utils/apperror.js"
import bcrypt from 'bcrypt'



export const updateuser = 
    async (req, res, next) => {
        const { email, recoveryemail, mobilenumber, Dob, lastName, firstName } = req.body
        const userid = req.user._id

        const checklogging = req.user.status
        if (checklogging === 'offline') {
            return next(new AppError('you are offline', 401))
        }

        const user = await User.findById(userid);
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        if (userid.toString() !== user._id.toString()) {
            return next(new AppError('Unauthorized to update this account', 403));
        }

        if (email && email !== user.email) {
            const existingUserWithEmail = await User.findOne({ email });
            if (existingUserWithEmail && existingUserWithEmail._id.toString() !== userid) {
                return next(new AppError('Email already in use', 400));
            }
            user.email = email;
        }

        if (recoveryemail) {
            user.recoveryemail = recoveryemail;
          }
        // Check if mobileNumber is being updated and if it conflicts with existing data
        if (mobilenumber && mobilenumber !== user.mobilenumber) {
            const existingUserWithMobile = await User.findOne({ mobilenumber });
            if (existingUserWithMobile && existingUserWithMobile._id.toString() !== userid) {
                return next(new AppError('Mobile number already in use', 400));
            }
            user.mobilenumber = mobilenumber;
        }
        user.lastname = lastName;
        user.firstname = firstName;
        user.Dob = Dob;
        await user.save();
        return res.json({ message: "user updated", success: true })


    }





export const deleteuser =



    async (req, res, next) => {
        const userid = req.user._id

        const checklogging = req.user.status
        if (checklogging === 'offline') {
            return next(new AppError('you are offline', 401))
        }

        const user = await User.findById(userid);
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        if (userid.toString() !== user._id.toString()) {
            return next(new AppError('Unauthorized to update this account', 403));
        }

       

        await user.deleteOne();
        return res.json({ message: "user deleted", success: true })


    }









export const getuser =  async (req, res, next) => {
        const userid = req.user._id

        const checklogging = req.user.status
        if (checklogging === 'offline') {
            return next(new AppError('you are offline', 401))
        }

        const user = await User.findById(userid);
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        if (userid.toString() !== user._id.toString()) {
            return next(new AppError('Unauthorized to update this account', 403));
        }

       

        await User.findOne();
        return res.json({success: true ,user})


    }



export const getprofile = 


    async (req, res, next) => {
        const {userid} = req.params

   

        const user = await User.findById(userid);
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        if (userid.toString() !== user._id.toString()) {
            return next(new AppError('Unauthorized to update this account', 403));
        }

       

        await User.findOne();
        return res.json({success: true ,user})


    }








export const updatepassword = async (req, res, next) => {
        const {currentpassword, newpassword} = req.body
        const userid = req.user._id

        const user = await User.findById(userid);
        if (!user){
            return next(new AppError('User not found', 404));
        }
     const ismatch = bcrypt.compare(currentpassword, user.password)
     if(!ismatch){
        return next(new AppError('invalid creadintials', 400))
     }   

     if (currentpassword === newpassword) {
        return next(new AppError('New password cannot be the same as the current password', 400));
      }

      const hashedpasssword = await bcrypt.hashSync(newpassword, 10)

      user.password = hashedpasssword
      await user.save();
      return res.json({ message: "password updated", success: true })
    }





export const getAccountsByRecoveryEmail =
    async (req, res, next) => {
    const { recoveryEmail } = req.params
  
    if (!recoveryEmail) {
      return next(new AppError('Recovery email is required', 400));
    }
  
    // Fetch users from the database by recovery email
    const users = await User.find({ recoveryemail: recoveryEmail });
  
    if (!users || users.length === 0) {
      return next(new AppError('No accounts associated with this recovery email', 404));
    }
  
    // Return the list of users
    return res.json({ message: 'Accounts retrieved successfully', success: true, data: users });
  };











  
export const resetpass =
    async (req, res, next) => {
        
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email, resetotp: otp, otpexpiry: { $gt: Date.now() } });

        if (!user) {
            return next(new AppError('Invalid or EXPIRED OTP', 400));
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    user.password = hashedPassword;
    user.resetotp = null;
    user.otpexpiry = null;
    await user.save();
    return res.json({ message: 'Password reset successful', success: true });
    }




  



