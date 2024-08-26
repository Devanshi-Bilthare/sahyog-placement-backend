const express = require('express')
const { Register, Login, Profile, update, getAllCandidates, getSingleCandidate, deleteCandidate } = require('../controllers/candidateControllers')
const { authMiddleware } = require('../middlewares/authMiddlewares')
const router = express.Router()


router.post('/register',Register)
router.post('/login',Login)


router.put('/update/:id',update)


router.get('/profile',authMiddleware, Profile)

router.get('/getAll',getAllCandidates)

router.get('/getSingleCandidate/:id',getSingleCandidate)

router.delete('/delete/:id',deleteCandidate)



module.exports = router