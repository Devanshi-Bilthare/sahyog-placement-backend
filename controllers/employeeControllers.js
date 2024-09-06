const EmployeeModel = require('../models/employeeModel')
const { generateToken } = require('../config/jwtToken')
const asyncHandler = require('express-async-handler')
const {generateRefreshToken} = require('../config/refreshToken')

const Register = asyncHandler( async(req,res)=>{
    const {mobile} = req.body
    const findEmployee = await EmployeeModel.findOne({mobile})
    // console.log(req.body)
    if(!findEmployee){
        const newEmployee =await EmployeeModel.create(req.body)
        res.json(newEmployee)
    }else{
        throw new Error('EmployeeModel ALready Exists')
    }
})

const Login = asyncHandler(async(req,res)=>{
    const {email,password} = req.body
    // check if user exists or not
    const findEmployee = await EmployeeModel.findOne({email})
    if(findEmployee && await findEmployee.isPasswordMatched(password)){
        const refreshToken = await generateRefreshToken(findEmployee._id)
        const updateEmployee = await EmployeeModel.findOneAndUpdate(findEmployee._id,{refreshToken},{new:true})
        res.cookie('refreshToken',refreshToken,{
            httpOnly:true,
            maxAge : 72 * 60 * 60 * 1000
        })
        res.json({
            _id:findEmployee._id,
            name:findEmployee.name,
            email:findEmployee.email,
            mobile:findEmployee.mobile,
            role:findEmployee.role,
            token:generateToken(findEmployee._id)
        })
    }else{
        throw new Error('Invalid credientials')
    }
})



const update = asyncHandler(async(req,res)=>{
    try{
        // console.log(req.user)
        console.log(req.body)
        const {id}  = req.params
        const updatedEmployee = await EmployeeModel.findByIdAndUpdate(id,req.body,{
            new :true
        })

        console.log(updatedEmployee)
        res.json(updatedEmployee)
       }catch(err){
        throw new Error(err)
       }
})

const getAllEmployees = asyncHandler(async (req, res) => {
    try {
        const allEmployees = await EmployeeModel.find().populate('allotedVacancies');
        console.log("All Employees:", allEmployees); // Logs to confirm data retrieval

        if (!allEmployees) {
            return res.status(404).json({ message: "No employees found" });
        }

        res.status(200).json(allEmployees);
    } catch (err) {
        console.error("Error retrieving employees:", err); // Logs error details
        res.status(500).json({ message: 'Failed to retrieve employees', error: err.message });
    }
});

const getSingleEmployees = asyncHandler(async(req,res)=>{
    try{
        const {id} = req.params
       const singleEmployees = await EmployeeModel.findById(id).populate('allotedVacancies')
        res.json(singleEmployees)
       }catch(err){
        throw new Error(err)
       }
})

const deleteEmployee = asyncHandler(async(req,res)=>{
    try{
        const {id} = req.params
       const deletedEmployees = await EmployeeModel.findByIdAndDelete(id)
        res.json(deletedEmployees)
       }catch(err){
        throw new Error(err)
       }
})

 module.exports = {Register,Login,update,getAllEmployees,getSingleEmployees,deleteEmployee}