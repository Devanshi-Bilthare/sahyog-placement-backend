const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    minlength: [2, 'Company name must be at least 2 characters long'],
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true,
    minlength: [2, 'Role must be at least 2 characters long'],
  },
  experienceRequired: {
    type: String,
    // required: [true, 'Experience required is necessary'],
    trim: true,
  },
  ageRequired:{
    type: String,  
  },
  education:{
    type: String,  
  },
  gender:{
    type:String
  },
 
  skillsRequired: {
    type: String,  // Array of strings to hold multiple skills
    // required: [true, 'At least one skill is required'],
  },
  jobDescription:{
    type: String,
  },
  numberOfJobOpenings: {
    type: Number,
    required: [true, 'Number of job openings is required'],
    min: [1, 'There must be at least one job opening'],
  },
  salary: {
    type: String,
    // required: [true, 'Salary is required'],
    trim: true,
  },
  jobLocation: {
    type: String,
    required: [true, 'Job location is required'],
    trim: true,
    minlength: [2, 'Job location must be at least 2 characters long'],
  },
  city:String,
  companyId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Company'
  },
  deadline:{
    type:String
  },
  AppliedBy:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }],
  allotedTo:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Employee',
  },
  status:{
    type:String,
    default:"Pending"
  },
  mail:{
    type:String,
    default:"pending"
  },
  jobFunction:{
    type:String
  },
  interviewSheduled:{
    type:Date,
  }
  
}, {
  timestamps: true
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
