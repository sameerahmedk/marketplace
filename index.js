const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const SupplierRoute = require('./routes/SupplierRoute')
const RetailerRoute = require('./routes/RetailerRoute')
const ProductRoute = require('./routes/ProductRoute')
const bodyParser = require('body-parser')
const authRouter = require('./routes/auth.routes')

const url3 = process.env.MONGO_URI

const app = express()
const cors = require('cors')
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/auth', authRouter)
app.use('/supplier', SupplierRoute)
app.use('/retailer', RetailerRoute)
app.use('/product', ProductRoute)

mongoose.connect(url3, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const con = mongoose.connection

con.on('open', function () {
  console.log('connected...')
})

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
  .catch((error) => {
    console.log('database connection failed. exiting now...')
    console.error(error)
    process.exit(1)
  })

app.listen(8080, () => {
  console.log('server started')
})
