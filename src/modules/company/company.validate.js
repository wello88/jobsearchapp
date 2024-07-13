import joi from 'joi'

//calidate company data
export const companyval = joi.object({
    companyname: joi.string().required(),
    description: joi.string().required(),
    industry: joi.string().required(),
    address: joi.string().required(),
    num_of_employees: joi.string().required(),
    companyemail: joi.string().email().required(),
    company_HR: joi.string().required()
})


//update data validation

export const updatecompanyval = joi.object({
    companyname: joi.string(),
    description: joi.string(),
    industry: joi.string(),
    address: joi.string(),
    num_of_employees: joi.string(),
    companyemail: joi.string().email(),
    company_HR: joi.string()
})