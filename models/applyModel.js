const mongoose = require('mongoose');

const applySchema = new mongoose.Schema({
    jobId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job'
    },
    candidateId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Candidate'
    },
    employedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Employee"
    }
}, {
  timestamps: true
});

const Apply = mongoose.model('Apply', applySchema);

module.exports = Apply;
