import { Application } from "../../../db/models/application.model.js"
import { Company } from "../../../db/models/company.model.js"
import { Job } from "../../../db/models/job.model.js"
import { User } from "../../../db/models/user.model.js"
import { AppError } from "../../utils/apperror.js"
import { sendEmail } from "../../utils/sendEmail.js"
import jwt from "jsonwebtoken"

export const add_company = async (req, res, next) => {

    const { companyname, description, industry, address, num_of_employees, companyemail, company_HR } = req.body

    const company = await Company.findOne({ companyname })
    if (company) {

        return next(new AppError('company already exist', 401))
    }

    const add = new Company({
        companyname,
        description,
        industry,
        address,
        num_of_employees,
        companyemail,
        company_HR
    })
    const newcompany = await add.save()
    if (!newcompany) {

        return next(new AppError('company not saved', 401))
    }


    const token = jwt.sign({ companyemail }, 'secret', { expiresIn: '1h' })
    sendEmail(companyemail, token)
    return res.json({ message: 'company added', success: true })
}


export const updateCompany = async (req, res, next) => {
    const { id } = req.user
    const { companyname, description, industry, address, num_of_employees, companyemail } = req.body;

    // Check if the company exists by companyHR
    const company = await Company.findOne({ company_HR: id });
    if (!company) {
        return next(new AppError('Company does not exist', 404));
    }

    // Prepare data and update
    const updatedCompany = await Company.findOneAndUpdate(
        { company_HR: id },
        {
            companyname,
            description,
            industry,
            address,
            num_of_employees,
            companyemail
        },
        { new: true }
    );

    return res.status(200).json({ message: 'Company updated successfully', success: true, data: updatedCompany });
};



export const deletecompany = async (req, res, next) => {
    const { userid } = req.user;

    // Check if the company exists by companyHR
    const company = await Company.findOne({ company_HR: userid });
    if (!company) {
        return next(new AppError('Company does not exist', 404));
    }

    // Prepare data and update
    const deletecompany = await Company.findOneAndDelete()

    return res.status(200).json({ message: 'Company deleted successfully', success: true, data: deletecompany });
};



export const getcompany = async (req, res, next) => {
    const { companyid } = req.params

    const company = await Company.findById({ _id: companyid })
    if (!company) {
        return next(new AppError('company not found', 404))
    }
    const job = await Job.find({ addedBy: company.company_HR })
    if (job.length === 0) {
        return res.status(200).json({ message: 'no jobs for this company', success: true })
    }

    return res.status(200).json({ data: job, success: true })
}



export const searchcompany = async (req, res, next) => {
    const { name } = req.query
    const company = await Company.find({ companyname: new RegExp(name, 'i') })

    if (!company.length) {
        return next(new AppError('No companies found with this name', 404));
    }


    return res.status(200).json({ message: 'Companies fetched successfully', success: true, data: companies });
};



export const getapplications = async (req, res, next) => {

    const { jobId } = req.params;
    const userid = req.user._id;

    // Find the job and check if it belongs to the logged in user(company_hr)
    const job = await Job.findById(jobId);
    if (!job) {
        return next(new AppError('Job not found', 404));
    }

    if (job.addedBy.toString() !== userid.toString()) {
        return next(new AppError('Unauthorized to access this job applications', 403));
    }

    const applications = await Application.find({ jobId }).populate('userid', '-password');
    if(applications.length === 0){
        return next(new AppError('No applications found', 404));
    }
    return res.status(200).json({success:true,data:applications})


}