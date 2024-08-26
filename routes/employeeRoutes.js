const express = require('express')
const { Register, Login, update, getAllEmployees, deleteEmployee, getSingleEmployees } = require('../controllers/employeeControllers')
// const { getSingleCandidate } = require('../controllers/candidateControllers')
const { isAdmin } = require('../middlewares/authMiddlewares')
const router = express.Router()

router.post('/',Register)

router.post('/login',Login)


router.put('/update/:id',isAdmin,update)

router.get('/getAll',isAdmin,getAllEmployees)

router.get('/getSingleEmploye/:id',getSingleEmployees)

router.delete('/delete/:id',isAdmin,deleteEmployee)

module.exports = router