const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  mobile: {
    type: String,
    unique:true,
    // required: [true, 'Mobile number is required'],
    trim: true,
    match: [
        /^[0-9]{10}$/,
        "Please enter a valid 10-digit mobile number"
    ],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    unique: true,
    match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address"
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
},
  state: {
    type: String,
    // required: [true, 'State is required'],
    trim: true,
  },
  city: {
    type: String,
    // required: [true, 'City is required'],
    trim: true,
  },
  highestQualification:{
    type: String,
    required: [true, 'highest qualification is required is required'],
    trim: true,
  },
  // Post Graduation Fields
  postGradApplyYear: {
    type: String,
    // required: [true, 'Post Graduation Apply Year is required'],
    trim: true,
    match: [/^\d{4}$/, 'Apply Year must be a valid year'],
  },
  postGradPassingYear: {
    type: String,
    // required: [true, 'Post Graduation Passing Year is required'],
    trim: true,
    match: [/^\d{4}$/, 'Passing Year must be a valid year'],
  },
  postGradPercentage: {
    type: String,
    // required: [true, 'Post Graduation Percentage is required'],
    trim: true,
    match: [/^\d{1,2}(\.\d{1,2})?$/, 'Percentage must be a valid number between 0 and 100'],
  },
  postGradUniversityName: {
    type: String,
    // required: [true, 'Post Graduation University Name is required'],
    trim: true,
  },
  postGradSubject: {
    type: String,
    // required: [true, 'Post Graduation Subject is required'],
    trim: true,
  },
  // Graduation Fields
  gradApplyYear: {
    type: String,
    // required: [true, 'Graduation Apply Year is required'],
    trim: true,
    match: [/^\d{4}$/, 'Apply Year must be a valid year'],
  },
  gradPassingYear: {
    type: String,
    // required: [true, 'Graduation Passing Year is required'],
    trim: true,
    match: [/^\d{4}$/, 'Passing Year must be a valid year'],
  },
  gradPercentage: {
    type: String,
    // required: [true, 'Graduation Percentage is required'],
    trim: true,
    match: [/^\d{1,2}(\.\d{1,2})?$/, 'Percentage must be a valid number between 0 and 100'],
  },
  gradUniversityName: {
    type: String,
    // required: [true, 'Graduation University Name is required'],
    trim: true,
  },
  gradSubject: {
    type: String,
    // required: [true, 'Graduation Subject is required'],
    trim: true,
  },
  // 12th Grade Fields
  twelfthPassingYear: {
    type: String,
    // required: [true, '12th Passing Year is required'],
    trim: true,
    match: [/^\d{4}$/, 'Passing Year must be a valid year'],
  },
  twelfthPercentage: {
    type: String,
    // required: [true, '12th Percentage is required'],
    trim: true,
    match: [/^\d{1,2}(\.\d{1,2})?$/, 'Percentage must be a valid number between 0 and 100'],
  },
  twelfthBoardName: {
    type: String,
    // required: [true, '12th Board Name is required'],
    trim: true,
  },
  twelfthSubject: {
    type: String,
    // required: [true, '12th Subject is required'],
    trim: true,
  },
  twelfthSchoolName: {
    type: String,
    // required: [true, '12th School Name is required'],
    trim: true,
  },
  // 10th Grade Fields
  tenthPassingYear: {
    type: String,
    // required: [true, '10th Passing Year is required'],
    trim: true,
    match: [/^\d{4}$/, 'Passing Year must be a valid year'],
  },
  tenthPercentage: {
    type: String,
    // required: [true, '10th Percentage is required'],
    trim: true,
    match: [/^\d{1,2}(\.\d{1,2})?$/, 'Percentage must be a valid number between 0 and 100'],
  },
  tenthBoardName: {
    type: String,
    // required: [true, '10th Board Name is required'],
    trim: true,
  },
  tenthSchoolName: {
    type: String,
    // required: [true, '10th School Name is required'],
    trim: true,
  },
  dob: {
    type: Date,
    // required: [true, 'Date of Birth is required'],
  },
  twoWheelerAvailable: {
    type: Boolean,
    // required: [true, 'Two Wheeler Availability is required'],
  },
  drivingLicense: {
    type: Boolean,
    // required: [true, 'Driving License Availability is required'],
  },
  resumeUrl: {
    type: String,
    required: false, // You can set it to required if it's mandatory
},
jobsApplied:[{
  type:mongoose.Schema.Types.ObjectId,
  ref:'Job'
}],
status:{
  type:String,
  default:"Pending"
},
gender:{
  type:String
}

}, {
  timestamps: true
});

candidateSchema.pre('save', async function (next) {
  if (!this.isModified("password")) {
      next();
  }
  const salt = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});

candidateSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
