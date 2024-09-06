const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'], 
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'], 
  },
  storePassword:{
    type:String
  },
  role: {
    type: String,
    default:'employee' 
  },
  email: {
    type: String,
    // required: [true, 'Email is required'], 
    trim: true,
    unique: true,
    match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address"
    ],
  },
  address: {
    type: String,
    // required: [true, 'Address is required'], 
    trim: true,
    // minlength: [5, 'Address must be at least 5 characters long'], 
  },
  password:{
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
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
  city: {
    type: String,
    // required: [true, 'City is required'],
    trim: true,
    // minlength: [2, 'City name must be at least 2 characters long'], 
  },
  gender:{
    type:String
  },
  allotedVacancies:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Job'
  }],
}, {
  timestamps: true
});

employeeSchema.pre('save', async function (next) {
  if (!this.isModified("password")) {
      next();
  }
  const salt = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});

employeeSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
