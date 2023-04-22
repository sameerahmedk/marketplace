const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const SupplierRoute = require('./routes/SupplierRoute')
const RetailerRoute = require('./routes/RetailerRoute')
const ProductRoute = require('./routes/ProductRoute')
const bodyParser = require('body-parser')
const authRouter = require('./routes/auth.routes').default

const url3 = process.env.MONGO_URL

const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use('/auth', authRouter)
app.use('/supplier', SupplierRoute)
app.use('/retailer', RetailerRoute)
app.use('/product', ProductRoute)

const { MONGO_URI } = process.env

// Connecting to the database
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Successfully connected to database')
  })
  .catch(error => {
    console.log('database connection failed. exiting now...')
    console.error(error)
    process.exit(1)
  })

app.listen(8080, () => {
  console.log('server started')
})
