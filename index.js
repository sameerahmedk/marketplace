//console.log("hello world")

const express = require('express')
const mongoose = require('mongoose')
//const morgon=require('morgan') 
require('dotenv').config()
const SupplierRoute = require('./routes/SupplierRoute')
const RetailerRoute = require('./routes/RetailerRoute')
const ProductRoute = require('./routes/ProductRoute')
const bodyParser = require('body-parser');
const authRouter = require('./routes/auth.routes')
//const {verifyAccessToken} = require('./helpers/jwtHelper')

const url3= 'mongodb://127.0.0.1/Web_Project'

const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/auth', authRouter)
app.use('/supplier',SupplierRoute)
app.use('/retailer',RetailerRoute)
app.use('/product',ProductRoute)

mongoose.connect(url3,{useNewUrlParser:true,useUnifiedTopology:true})
const con = mongoose.connection

con.on('open',function(){
    console.log('connected...')
})  

app.listen(3000,()=>{
    console.log('server started')
})

// const express = require('express');
// const router = express.Router();