import { asyncHandler } from "../../middleware/asynchandler.js"
import { User } from "../../../db/models/user.model.js"
import { AppError } from "../../utils/apperror.js"
import bcrypt from 'bcrypt'


//update user
export const updateuser =
    async (req, res, next) => {
        // distruct data from req.body
        const { email, recoveryemail, mobilenumber, Dob, lastName, firstName } = req.body
        const userid = req.user._id
        // distruct userid from req.user(token)

        const checklogging = req.user.status
        //check if user is online
        if (checklogging === 'offline') {
            return next(new AppError('you are offline', 401))
        }
        //find by id
        const user = await User.findById(userid);
        if (!user) {
            return next(new AppError('User not found', 404));
        }
        //check if userid = to user . id
        if (userid.toString() !== user._id.toString()) {
            return next(new AppError('Unauthorized to update this account', 403));
        }
        //check if email is being updated and if it conflicts with existing data
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



//delete user account

export const deleteuser = async (req, res, next) => {
        const userid = req.user._id

        //check if user is online
        const checklogging = req.user.status
        if (checklogging === 'offline') {
            return next(new AppError('you are offline', 401))
        }
        //find by id
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


//get user by id
export const getuser = async (req, res, next) => {
    const userid = req.user._id
    //check if user is online

    const checklogging = req.user.status
    if (checklogging === 'offline') {
        return next(new AppError('you are offline', 401))
    }
    //find by id
    const user = await User.findById(userid);
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    //check if userid = to user . id
    if (userid.toString() !== user._id.toString()) {
        return next(new AppError('Unauthorized to update this account', 403));
    }
    await User.findOne();
    return res.json({ success: true, user })


}


//get profile
export const getprofile =
    async (req, res, next) => {
        // distruct userid from req.user 
        const { userid } = req.params
        //find by id

        const user = await User.findById(userid);
        //check if user exist
        if (!user) {
            return next(new AppError('User not found', 404));
        }
        //check if userid = to user . id 

        if (userid.toString() !== user._id.toString()) {
            return next(new AppError('Unauthorized to update this account', 403));
        }


        await User.findOne();
        return res.json({ success: true, user })


    }




//update password using current password and new password
export const updatepassword = async (req, res, next) => {
    const { currentpassword, newpassword } = req.body
    // distrcut user id from req.user
    const userid = req.user._id
    //find by id
    const user = await User.findById(userid);
    //check if user exist
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    //check if password is correct
    const ismatch = bcrypt.compare(currentpassword, user.password)
    if (!ismatch) {
        return next(new AppError('invalid creadintials', 400))
    }
    //check if new password is same as current password

    if (currentpassword === newpassword) {
        return next(new AppError('New password cannot be the same as the current password', 400));
    }
    //hash new password

    const hashedpasssword = await bcrypt.hashSync(newpassword, 10)
    //update password
    user.password = hashedpasssword
    //save password to database
    await user.save();
    return res.json({ message: "password updated", success: true })
}



//get accounts by recovery email
export const getAccountsByRecoveryEmail = async (req, res, next) => {
        const { recoveryEmail } = req.params
        //check if recovery email is provided
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


//reset password using otp

export const resetpass =async (req, res, next) => {

        const { email, otp, newPassword } = req.body;
        //checking in user database
        const user = await User.findOne({ email, resetotp: otp, otpexpiry: { $gt: Date.now() } });

        if (!user) {
            return next(new AppError('Invalid or EXPIRED OTP', 400));
        }
        //hashing new password
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        //updating password
        user.password = hashedPassword;
        //resetting otp and expiry
        user.resetotp = null;
        user.otpexpiry = null;
        //saveing user
        await user.save();

        return res.json({ message: 'Password reset successful', success: true });
    }

