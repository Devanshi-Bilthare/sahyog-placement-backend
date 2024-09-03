const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    minlength: [2, 'Company name must be at least 2 characters long'],
  },
  companyWebsite: {
    type: String,
    // required: [true, 'Company website is required'],
    trim: true,
  },
  contactPersonName: {
    type: String,
    // required: [true, 'Contact person name is required'],
    // trim: true,
    // minlength: [2, 'Contact person name must be at least 2 characters long'],
  },
  contactPersonMobile: {
    type: String,
    // required: [true, 'Contact person mobile number is required'],
    // trim: true,
    // match: [
    //     /^[0-9]{10}$/,
    //     "Please enter a valid 10-digit mobile number"
    // ],
  },
  contactPersonEmail: {
    type: String,
    // required: [true, 'Contact person email is required'],
    // trim: true,
    // unique: true,
    // match: [
    //     /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    //     "Please enter a valid email address"
    // ],
  },
  address: {
    type: String,
    // required: [true, 'Address is required'],
    // trim: true,
    // minlength: [5, 'Address must be at least 5 characters long'],
  },
  city: {
    type: String,
    // required: [true, 'City is required'],
    // trim: true,
    // minlength: [2, 'City name must be at least 2 characters long'],
  },
  industry: {
    type: String,
    // required: [true, 'Industry is required'],
    // trim: true,
    // minlength: [2, 'Industry must be at least 2 characters long'],
  },
  note:{
    type: String,
    trim: true,
  },
  jobs:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Job'
  }]
}, {
  timestamps: true
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
