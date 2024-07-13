import joi from "joi";

export const updateval = joi.object({
    firstname:joi.string().required(),
    lastname:joi.string().required() ,
      email: joi.string().required(),
    recoveryemail: joi.string().email().required(),
    Dob:joi.string().pattern(new RegExp("^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$")).required(),
    mobilenumber:joi.string().required().pattern(new RegExp("^01[0125]\\d{8}$")),
})



export const updatePasswordval = joi.object({
    currentpassword: joi.string().required(),
    newpassword: joi.string().required()
});



export const recoveryEmailval = joi.object({
    recoveryEmail: joi.string().email().required()
});



export const resetPasswordval = joi.object({
    email: joi.string().email().required(),
    otp: joi.string().required(),
    newPassword: joi.string().min(8).required()
});