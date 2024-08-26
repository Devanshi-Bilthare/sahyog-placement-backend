const express = require('express')
const { applyJob, isAppliedByUser, allJobsAppliedByCandidate, applyToJob, getShortlistedCandidatesByJob } = require('../controllers/applyControllers')
const { authMiddleware } = require('../middlewares/authMiddlewares')
const router = express.Router()

router.post('/',applyJob)

router.post('/applyToJob',applyToJob)

router.get('/isApplied/:id',authMiddleware,isAppliedByUser)


router.get('/alljob/:id',allJobsAppliedByCandidate)

router.get('/candidateShortlistedByJob/:jobId',getShortlistedCandidatesByJob)

module.exports = router