import joi from 'joi'

export const signupval = joi.object({
    firstname:joi.string().required(),
    lastname:joi.string().required() ,
      email: joi.string().required(),
    password: joi.string().required().pattern(new RegExp("[a-zA-Z0-9]{3,30}$")),
    repassword:joi.valid(joi.ref('password')).required(),
    recoveryemail: joi.string().email().required(),
    Dob:joi.string().pattern(new RegExp("^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$")).required(),
    mobilenumber:joi.string().required().pattern(new RegExp("^01[0125]\\d{8}$")),
    role: joi.string().required()

})


export const signinval = joi.object({
    email: joi.string().email(),
    recoveryemail: joi.string().email(),
    mobilenumber: joi.string().pattern(new RegExp("^01[0125]\\d{8}$")),
    password: joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
})