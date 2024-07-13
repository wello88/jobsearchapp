import { Application } from "../../../db/models/application.model.js"
import { Company } from "../../../db/models/company.model.js"
import { Job } from "../../../db/models/job.model.js"
import { AppError } from "../../utils/apperror.js"
import { sendEmail } from "../../utils/sendEmail.js"
import jwt from "jsonwebtoken"
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import excel from 'exceljs';
// create company as hr
export const add_company = async (req, res, next) => {

    const { companyname, description, industry, address, num_of_employees, companyemail, company_HR } = req.body

    const company = await Company.findOne({ companyname })
    if (company) {

        return next(new AppError('company already exist', 401))
    }
    //prepare data
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

    //genrate token
    const token = jwt.sign({ companyemail }, process.env.JWT_SECRET, { expiresIn: '1h' })
    sendEmail(companyemail, token)
    return res.json({ message: 'company added ,please check your email to verify', success: true })
}

//update company

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


//deleting company and any related data(jobs & applications)
export const deletecompany = async (req, res, next) => {
    const userid = req.user._id

    // Check if the company exists by companyHR
    const company = await Company.findOne({ company_HR: userid });
    if (!company) {
        return next(new AppError('Company does not exist', 404));
    }
    // Find all jobs associated with the company
    const jobs = await Job.find({ companyid: company._id });

    // Extract job IDs
    const jobIds = jobs.map(job => job._id);

    // Delete applications related to the jobs
    await Application.deleteMany({ jobId: { $in: jobIds } });

    // Delete the jobs 
    await Job.deleteMany({ companyid: company._id });

    // Delete the company 
    const deletedCompany = await Company.findOneAndDelete({ _id: company._id });

    // update successfully

    return res.status(200).json({ message: 'Company deleted successfully', success: true, data: deletedCompany });
};


// Get a specific company 

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


// Search for companies by name

export const searchcompany = async (req, res, next) => {
    const { name } = req.query
    const company = await Company.find({ companyname: new RegExp(name, 'i') })

    if (!company.length) {
        return next(new AppError('No companies found with this name', 404));
    }


    return res.status(200).json({ message: 'Companies fetched successfully', success: true, data: companies });
};

//get applications for a specific job

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
    if (applications.length === 0) {
        return next(new AppError('No applications found', 404));
    }
    return res.status(200).json({ success: true, data: applications })


}


/////////////////// bonus task ///////////////

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getApplicationsByCompanyAndDate = async (req, res, next) => {
    const { companyid } = req.params;
    const { date } = req.query;

    // Construct date range for the query
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch applications for the company on the specified date
    const applications = await Application.find({
        jobId: { $in: await Job.find({ companyid }, '_id') },
        createdAt: { $gte: startOfDay, $lte: endOfDay }
    }).populate('userid', 'username email'); // Populate user details

    if (!applications || applications.length === 0) {
        return res.status(404).json({ message: 'No applications found for the specified date', success: false });
    }

    // Create Excel workbook
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Applications');

    // Define columns
    worksheet.columns = [
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Tech Skills', key: 'techSkills', width: 40 },
        { header: 'Soft Skills', key: 'softSkills', width: 40 },
        { header: 'Resume URL', key: 'resumeURL', width: 50 },
        { header: 'createdAt', key: 'createdAt', width: 20 }
    ];

    // Populate rows with application data
    applications.forEach(application => {
        worksheet.addRow({
            email: application.userid.email,
            jobTitle: application.jobId.jobTitle,
            techSkills: application.userTechSkills.join(', '),
            softSkills: application.userSoftSkills.join(', '),
            resumeURL: application.userResume,
            createdAt: application.createdAt.toLocaleString()
        });
    });

    // Generate Excel file
    const fileName = `applications_${companyid}_${date.replace(/-/g, '_')}.xlsx`;
    const filePath = path.join(__dirname, '..', '..', 'excelsheets', fileName);

    try {
        // Ensure the excelsheets directory exists
        const excelsheetsDir = path.join(__dirname, '..', '..', 'excelsheets');
        if (!fs.existsSync(excelsheetsDir)) {
            fs.mkdirSync(excelsheetsDir, { recursive: true });
        }

        // Write the Excel file
        await workbook.xlsx.writeFile(filePath);

        // Send success response
        res.status(200).json({ message: 'Excel file generated successfully', success: true, filePath });
    } catch (error) {
        console.error('Error generating Excel:', error);
        return res.status(500).json({ message: 'Failed to generate Excel file', success: false });
    }

};