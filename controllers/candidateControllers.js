const CandidateModel = require('../models/CandidateModel')
const asyncHandler = require('express-async-handler')
const { generateToken } = require('../config/jwtToken')
const {generateRefreshToken} = require('../config/refreshToken')
const cloudinary = require('../config/cloudinaryConfig');

// const Register = asyncHandler( async(req,res)=>{
//     const {email} = req.body
//     const findCandidate = await CandidateModel.findOne({email})
//     console.log(req.body)
//     if(!findCandidate){
//         const newCandidate =await CandidateModel.create(req.body)
//         res.json(newCandidate)
//     }else{
//         throw new Error('CandidateModel ALready Exists')
//     }
// })

const Register = asyncHandler(async (req, res) => {
    const { email, mobile } = req.body;

    // Check if all required fields are provided
    if (!email || !mobile) {
        return res.status(400).json({ message: 'Email and mobile number are required' });
    }

    // Check if the candidate already exists based on email
    const findCandidateByEmail = await CandidateModel.findOne({ email });
    if (findCandidateByEmail) {
        return res.status(409).json({ message: 'Candidate with this email already exists' });
    }

    // Check if the candidate already exists based on mobile number
    const findCandidateByMobile = await CandidateModel.findOne({ mobile });
    if (findCandidateByMobile) {
        return res.status(409).json({ message: 'Candidate with this mobile number already exists' });
    }

    let resumeUrl = '';
    if (req.files && req.files.resumeUrl) {
        const file = req.files.resumeUrl;

        // Validate file type and size before uploading (optional)
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.mimetype)) {
            return res.status(400).json({ message: 'Invalid file type. Please upload a PDF or Word document.' });
        }

        try {
            const result = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'resumes',
            });
            resumeUrl = result.secure_url;
        } catch (error) {
            return res.status(500).json({ message: 'File upload failed', error: error.message });
        }
    }

    try {
        const newCandidate = await CandidateModel.create({
            ...req.body,
            resumeUrl,
        });

        const token = generateToken(newCandidate._id);

        res.status(201).json({ newCandidate, token });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
});

const Login = asyncHandler(async(req,res)=>{
    const {email,password} = req.body
    // check if user exists or not
    const findCandidate = await CandidateModel.findOne({email})
    if(findCandidate && await findCandidate.isPasswordMatched(password)){
        const refreshToken = await generateRefreshToken(findCandidate._id)
        const updateCandidate = await CandidateModel.findOneAndUpdate(findCandidate._id,{refreshToken},{new:true})
        res.cookie('refreshToken',refreshToken,{
            httpOnly:true,
            maxAge : 72 * 60 * 60 * 1000
        })
        res.json({
            _id:findCandidate._id,
            name:findCandidate.name,
            email:findCandidate.email,
            mobile:findCandidate.mobile,
            token:generateToken(findCandidate._id)
        })
    }else{
        throw new Error('Invalid credientials')
    }
})

const Profile = asyncHandler( async(req,res)=>{
    const candidate = req.user
    res.json(candidate)
})


const update = asyncHandler(async(req,res)=>{
    try{
        // console.log(req.user)
        const {id}  = req.params
        console.log(id)
        const updatedCandidate = await CandidateModel.findByIdAndUpdate(id,req.body,{
            new :true
        })

        console.log(updatedCandidate)
        res.json(updatedCandidate)
       }catch(err){
        throw new Error(err)
       }
})

const getAllCandidates = asyncHandler(async(req,res)=>{
    try{
       const allCandidates = await CandidateModel.find()
        res.json(allCandidates)
       }catch(err){
        throw new Error(err)
       }
})

const getSingleCandidate = asyncHandler(async(req,res)=>{
    try{
        const {id} = req.params
       const singleCandidates = await CandidateModel.findById(id)
        res.json(singleCandidates)
       }catch(err){
        throw new Error(err)
       }
})

const deleteCandidate = asyncHandler(async(req,res)=>{
    try{
        const {id} = req.params
       const deletedCandidates = await CandidateModel.findByIdAndDelete(id)
        res.json(deletedCandidates)
       }catch(err){
        throw new Error(err)
       }
})

 module.exports = {Register,Login,Profile,update,getAllCandidates,getSingleCandidate,deleteCandidate}