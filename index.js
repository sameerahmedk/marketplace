const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const ProductRoute = require('./routes/ProductRoute')
const OrderRoute = require('./routes/OrderRoute')
const bodyParser = require('body-parser')
const authRouter = require('./routes/auth.routes')

const app = express()
const cors = require('cors')
const corsOptions = {
  origin: process.env.DOMAIN_URL,
  credentials: true,
  optionSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/auth', authRouter)
app.use('/product', ProductRoute)
app.use('/order', OrderRoute)

const { MONGO_URI, PORT } = process.env

// Connecting to the database
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Successfully connected to the database')
  })
  .catch((error) => {
    console.log('Database connection failed. Exiting now...')
    console.error(error)
    process.exit(1)
  })

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
