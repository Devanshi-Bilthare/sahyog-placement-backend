const Candidate = require('../models/CandidateModel');
const JobModel = require('../models/JobModel');
const ApplyModel = require('../models/applyModel')
const asyncHandler = require('express-async-handler');

const applyJob = asyncHandler(async (req, res) => {
    try {
        const {jobId,candidateId} = req.body
        const user = await Candidate.findById(candidateId)
        await ApplyModel.create({
            jobId,
            candidateId: candidateId
        })
        const job = await JobModel.findById(jobId)
        console.log(job)
        user?.jobsApplied.push(jobId)
        job.AppliedBy.push(user._id)
        await user.save()
        await job.save()

        res.json("job applied")
    } catch (err) {
        throw new Error(err.message);
    }
});

const applyToJob =  asyncHandler( async(req, res) => {
    try {
       const {jobId,candidates} = req.body
       const job = await JobModel.findById(jobId)
       candidates.map(async(candidateId)=>{
        await ApplyModel.create({
            jobId,
            candidateId: candidateId || req.user._id
        })
        
        const candidate = await Candidate.findById(candidateId)
        console.log(job)
        candidate.jobsApplied.push(jobId)
        candidate.status = "shortlisted"
        job?.AppliedBy?.push(candidateId)
        await candidate.save()
       })
       await job?.save()
        res.json("job applied")
    } catch (err) {
        throw new Error(err.message);
    }
});

const isAppliedByUser = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.params; 
       
        const job = await JobModel.findOne({
            _id: id,
            AppliedBy: userId 
        });

        if (job) {
            res.json({ applied: true, message: "Job already applied by the user" });
        } else {
            res.json({ applied: false, message: "User has not applied for this job" });
        }
    } catch (err) {
        throw new Error(err.message);
    }
});

const allJobsAppliedByCandidate = asyncHandler(async (req, res) => {
    try {
       let {id} = req.params
       const appliedJobs = await ApplyModel.find({ candidateId :id })
       .populate('jobId') // Populates the job details from the JOB model
       .exec();

       res.status(200).json(appliedJobs);
    } catch (err) {
        throw new Error(err.message);
    }
});

const getShortlistedCandidatesByJob = asyncHandler(async (req, res) => {
    try {
        const { jobId } = req.params;

        // Find all applications for the given job ID
        const applications = await ApplyModel.find({ jobId });

        // Extract candidate IDs from the applications
        const candidateIds = applications.map(application => application.candidateId);

        // Find candidates with the status "shortlisted"
        const shortlistedCandidates = await Candidate.find({
            _id: { $in: candidateIds },
            status: { $in: ["shortlisted", "Selected", "Interview Scheduled"] }
        });

        res.status(200).json(shortlistedCandidates);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});




module.exports = {
    applyJob,
    isAppliedByUser,
    allJobsAppliedByCandidate,
    applyToJob,
    getShortlistedCandidatesByJob
};
