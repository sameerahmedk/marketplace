//console.log("hello world")

const express = require("express");
const mongoose = require("mongoose");
//const morgon=require('morgan')
require("dotenv").config();
const SupplierRoute = require("./routes/SupplierRoute");
const RetailerRoute = require("./routes/RetailerRoute");
const ProductRoute = require("./routes/ProductRoute");
const bodyParser = require("body-parser");
const authRouter = require("./routes/auth.routes");
//const {verifyAccessToken} = require('./helpers/jwtHelper')
 //var cors = require('cors')

const url3 = "mongodb://127.0.0.1/Web_Project";

const app = express();
const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3001', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/auth", authRouter);
app.use("/supplier", SupplierRoute);
app.use("/retailer", RetailerRoute);
app.use("/product", ProductRoute);
// app.use(cors());

mongoose.connect(url3, { useNewUrlParser: true, useUnifiedTopology: true });
const con = mongoose.connection;

con.on("open", function () {
  console.log("connected...");
});

app.listen(8080, () => {
  console.log("server started");
});

// const express = require('express');
// const router = express.Router();
