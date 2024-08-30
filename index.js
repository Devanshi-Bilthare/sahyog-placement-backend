const dotenv = require('dotenv').config('./.env')
const express = require('express')
const dbConnect = require('./config/dbConnect')
dbConnect()
const { errorHandler, notFound } = require('./middlewares/errorHandler')
const app = express()
const cors = require('cors')
const fileUpload = require('express-fileupload');

const candidateRouter = require('./routes/candidateRoutes')
const companyRouter = require('./routes/companyRoutes')
const jobRouter = require('./routes/jobRoutes')
const applyRouter = require('./routes/applyRoutes')
const employeeRouter = require('./routes/employeeRoutes')
const contactRouter = require('./routes/contactRoutes')

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')

app.use(morgan('dev'))
app.use(cors())

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cookieParser())


app.use('/api/candidate',candidateRouter)
app.use('/api/company',companyRouter)
app.use('/api/job',jobRouter)
app.use('/api/apply',applyRouter)
app.use('/api/employee',employeeRouter)
app.use('/api/contact',contactRouter)

app.use(notFound)
app.use(errorHandler)


app.listen(process.env.PORT,()=>{
    console.log(`server running on ${process.env.PORT}`)
})