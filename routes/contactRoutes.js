const express = require('express')
const { createEnquiry } = require('../controllers/contactControllers')
const router = express.Router()

router.post('/create',createEnquiry)

module.exports = router