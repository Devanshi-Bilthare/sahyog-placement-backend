const express = require('express')
const { Register, Login, update, getAllEmployees, deleteEmployee, getSingleEmployees } = require('../controllers/employeeControllers')
// const { getSingleCandidate } = require('../controllers/candidateControllers')
const { isAdmin } = require('../middlewares/authMiddlewares')
const router = express.Router()

router.post('/',Register)

router.post('/login',Login)


router.put('/update/:id',update)

router.get('/getAll',getAllEmployees)

router.get('/getSingleEmploye/:id',getSingleEmployees)

router.delete('/delete/:id',deleteEmployee)

module.exports = router