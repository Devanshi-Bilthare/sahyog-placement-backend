const express = require('express')
const { createEnquiry, getAll } = require('../controllers/contactControllers')
const router = express.Router()

router.post('/create',createEnquiry)

router.get('/getAll',getAll)

module.exports = router