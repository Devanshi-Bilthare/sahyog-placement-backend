const express = require('express')
const { Create, EditJob, getAllJobs, Delete, getSingleJob } = require('../controllers/jobControllers')
const { isAdmin } = require('../middlewares/authMiddlewares')
const router = express.Router()

router.post('/create',isAdmin,Create)

router.put('/edit/:id',EditJob)

router.get('/getAll',isAdmin,getAllJobs)
router.get('/get/:id',getSingleJob)

router.delete('/delete/:id',Delete)



module.exports = router