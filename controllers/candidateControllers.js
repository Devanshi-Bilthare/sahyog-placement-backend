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
    const { email } = req.body;

    const findCandidate = await CandidateModel.findOne({ email });
    if (findCandidate) {
        throw new Error('Candidate already exists');
    }

    console.log(req.files)
    let resumeUrl = '';
    // if (req.files && req.files.resumeUrl) {
    //     const file = req.files.resumeUrl;

    //     try {
    //         const result = await cloudinary.uploader.upload(file.tempFilePath, {
    //             resource_type: 'raw',
    //             folder: 'resumes', 
    //         });
    //         resumeUrl = result.secure_url; 
    //     } catch (error) {
    //         throw new Error('File upload failed');
    //     }
    // } else {
    //     throw new Error('No file uploaded');
    // }

    const newCandidate = await CandidateModel.create({
        ...req.body,
        resumeUrl, 
    });

    const token = generateToken(newCandidate._id);

    res.json({ newCandidate, token });
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