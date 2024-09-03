const CompanyModel = require('../models/companyModel')
const JobModel = require('../models/JobModel')
const asyncHandler = require('express-async-handler')

const Register = asyncHandler( async(req,res)=>{
    let { companyName, companyWebsite, city, address, industry, contactPersonName, contactPersonMobile, contactPersonEmail, jobs } = req.body;

    const findCompany = await CompanyModel.findOne({ companyName });
    console.log(req.body);

    if (contactPersonEmail === "") {
        contactPersonEmail = null;  // Or simply omit this field if not required
      }
    
    if (!findCompany) {
        const newCompany = await CompanyModel.create({
            companyName,
            companyWebsite,
            city,
            address,
            industry,
            contactPersonName,
            contactPersonMobile,
            contactPersonEmail
        });
    
        if (Array.isArray(jobs) && jobs.length > 0) {
            for (const job of jobs) {
                const newJob = await JobModel.create({
                    companyId: newCompany._id,  
                    companyName:companyName,
                    ...job
                });

                newCompany.jobs.push(newJob._id)
                await newCompany.save()
            }
        }


    
        res.json({ company: newCompany, message: 'Company and jobs created successfully!' });
    } else {
        throw new Error('Company Already Exists');
    }
    
})


const Edit = asyncHandler( async(req,res)=>{
    const {id} = req.params
    try{
        const updatedCompany = await CompanyModel.findByIdAndUpdate(id,req.body)

        res.json(updatedCompany)
    }catch(err){
        throw new Error(err.message);
    }
})

const Delete = asyncHandler(async (req, res) => {
    const { id } = req.params; 
    const company = await CompanyModel.findById(id);

    if (!company) {
        res.status(404);
        throw new Error('Company not found');
    }

    await JobModel.deleteMany({ companyId: company._id });

    await CompanyModel.findByIdAndDelete(id)

    res.json({ message: 'Company and associated jobs deleted successfully!' });
});

const GetAllCompany = asyncHandler(async (req, res) => {
    try{
        const allCompanies = await CompanyModel.find()
        res.json(allCompanies)
    }catch(err){
        throw new Error(err.message);
    }

});

const GetSingleCompany = asyncHandler(async (req, res) => {
    try{
        const {id} = req.params
        const singleCompany = await CompanyModel.findById(id).populate('jobs')
        res.json(singleCompany)
    }catch(err){
        throw new Error(err.message);
    }

});

   


module.exports = {Register,Edit,Delete,GetAllCompany,GetSingleCompany}