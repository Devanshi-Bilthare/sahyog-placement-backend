const express = require('express')
const { Register, Edit, Delete, GetAllCompany, GetSingleCompany } = require('../controllers/companyControllers')
const { isAdmin } = require('../middlewares/authMiddlewares')
const router = express.Router()

router.post('/register',Register)


router.put('/edit/:id',isAdmin,Edit)

router.delete('/delete/:id',isAdmin,Delete)

router.get('/getAll',GetAllCompany)

router.get('/getOne/:id',GetSingleCompany)


module.exports = router