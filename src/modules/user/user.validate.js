import joi from "joi";
//update validation

export const updateval = joi.object({
    firstname: joi.string(),
    lastname: joi.string(),
    email: joi.string(),
    recoveryemail: joi.string().email(),
    Dob: joi.string().pattern(new RegExp("^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$")),
    mobilenumber: joi.string().pattern(new RegExp("^01[0125]\\d{8}$")),
})

//update password validation

export const updatePasswordval = joi.object({
    currentpassword: joi.string().required(),
    newpassword: joi.string().required()
});

//recovery email validation

export const recoveryEmailval = joi.object({
    recoveryEmail: joi.string().email().required()
});

//reset password validation

export const resetPasswordval = joi.object({
    email: joi.string().email().required(),
    otp: joi.string().required(),
    newPassword: joi.string().min(8).required()
});