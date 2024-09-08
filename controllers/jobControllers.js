const JobModel = require('../models/JobModel');
const CompanyModel = require('../models/companyModel');
const asyncHandler = require('express-async-handler');
const Employee = require('../models/employeeModel');

const Create = asyncHandler(async (req, res) => {
    const { companyName,role,experienceRequired,skillsRequired,numberOfJobOpenings, salary,jobLocation,jobDescription,deadline,ageRequired,education,gender,allotedTo,mail,jobFunction,city } = req.body;

    try {
        const company = await CompanyModel.findOne({ companyName });

        if (!company) {
            res.status(404);
            throw new Error('Company not found');
        }

        const newJob = await JobModel.create({
            companyName,role,experienceRequired,skillsRequired,numberOfJobOpenings, salary,jobLocation,jobDescription,deadline,ageRequired,education,gender,allotedTo,jobFunction,city,
            companyId: company._id ,mail
        });

        company.jobs.push(newJob._id);
        await company.save();

        
        if(allotedTo){
            const employee = await Employee.findById(allotedTo)

            employee.allotedVacancies.push(newJob)
            await employee.save()
        }

        res.json({ message: 'Job created and added to company successfully!', job: newJob });
    } catch (err) {
        throw new Error(err.message);
    }
});

const EditJob = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
        companyName,
        role,
        experienceRequired,
        skillsRequired,
        numberOfJobOpenings,
        salary,
        jobLocation,
        jobDescription,
        deadline,
        ageRequired,
        education,
        gender,
        allotedTo,
        status,
        mail,
        jobFunction,
        interviewSheduled,
        city
    } = req.body;

    try {
        const job = await JobModel.findById(id);

        if (!job) {
            res.status(404);
            throw new Error('Job not found');
        }

        // Store the previous allotment
        const previousAllotedTo = job.allotedTo;

        if (companyName) {
            const company = await CompanyModel.findOne({ companyName });
            if (!company) {
                res.status(404);
                throw new Error('Company not found');
            }
            job.companyId = company._id;
            job.companyName = companyName;
        }

        // Update job fields
        job.role = role || job.role;
        job.experienceRequired = experienceRequired || job.experienceRequired;
        job.skillsRequired = skillsRequired || job.skillsRequired;
        job.numberOfJobOpenings = numberOfJobOpenings || job.numberOfJobOpenings;
        job.salary = salary || job.salary;
        job.jobLocation = jobLocation || job.jobLocation;
        job.jobDescription = jobDescription || job.jobDescription;
        job.deadline = deadline || job.deadline;
        job.ageRequired = ageRequired || job.ageRequired;
        job.education = education || job.education;
        job.gender = gender || job.gender;
        job.status = status || job.status;
        job.mail = mail || job.mail;
        job.jobFunction = jobFunction || job.jobFunction;
        job.interviewSheduled = interviewSheduled || job.interviewSheduled;
        job.city = city || job.city;

        // Update `allotedTo` only if it has changed
        if (allotedTo && allotedTo !== previousAllotedTo) {
            job.allotedTo = allotedTo;

            // Handle previous allotment removal
            if (previousAllotedTo) {
                const previousEmployee = await Employee.findById(previousAllotedTo);
                if (previousEmployee) {
                    previousEmployee.allotedVacancies = previousEmployee.allotedVacancies.filter(
                        jobId => jobId.toString() !== id
                    );
                    await previousEmployee.save();
                }
            }

            // Handle new allotment addition
            const newEmployee = await Employee.findById(allotedTo);
            if (newEmployee) {
                newEmployee.allotedVacancies.push(job._id);
                await newEmployee.save();
            }
        }

        const updatedJob = await job.save();

        res.json({ message: 'Job updated successfully!', job: updatedJob });
    } catch (err) {
        res.status(500);
        throw new Error(err.message);
    }
});



const Delete = asyncHandler(async (req, res) => {
    const { id } = req.params; 

    try {
        const job = await JobModel.findById(id);

        if (!job) {
            res.status(404);
            throw new Error('Job not found');
        }

        const company = await CompanyModel.findById(job.companyId);
        if (company) {
            company.jobs = company.jobs.filter(jobId => jobId.toString() !== id);
            await company.save();
        }

        await JobModel.findByIdAndDelete(id);

        res.json({ message: 'Job deleted successfully!' });
    } catch (err) {
        throw new Error(err.message);
    }
});


const getAllJobs = asyncHandler(async (req, res) => {
   try{
        const allJobs = await JobModel.find().populate('allotedTo')
        res.json(allJobs)
    } catch (err) {
        throw new Error(err.message);
    }
});

const getSingleJob = asyncHandler(async (req, res) => {
    try{
        const {id} = req.params
         const singleJob = await JobModel.findById(id)
         res.json(singleJob)
     } catch (err) {
         throw new Error(err.message);
     }
 });


module.exports = {
    Create,
    EditJob,
    getAllJobs,
    Delete,
    getSingleJob
};
