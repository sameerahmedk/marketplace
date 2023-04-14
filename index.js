//console.log("hello world")

const express = require('express');
const mongoose = require('mongoose');
//const morgon=require('morgan')
require('dotenv').config();
const SupplierRoute = require('./routes/SupplierRoute');
const RetailerRoute = require('./routes/RetailerRoute');
const ProductRoute = require('./routes/ProductRoute');
const bodyParser = require('body-parser');
const authRouter = require('./routes/auth.routes');
//const {verifyAccessToken} = require('./helpers/jwtHelper')
//var cors = require('cors')

// const url3 = "mongodb://127.0.0.1/Web_Project";
const url3 = process.env.MONGO_URL;

const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true, //access-control-allow-credentials:true
	optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({ extended: true })
);
app.use(cookieParser());
app.use('/auth', authRouter);
app.use('/supplier', SupplierRoute);
app.use('/retailer', RetailerRoute);
app.use('/product', ProductRoute);
// app.use(cors());

// mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

// mongoose.connection.on('error', (err) => {
// 	console.log('err', err);
// });
// mongoose.connection.on(
// 	'connected',
// 	(err, res) => {
// 		console.log('mongoose is connected');
// 	}
// );

const { MONGO_URI } = process.env;

// Connecting to the database
mongoose
	.connect(MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log(
			'Successfully connected to database'
		);
	})
	.catch((error) => {
		console.log(
			'database connection failed. exiting now...'
		);
		console.error(error);
		process.exit(1);
	});

app.listen(8080, () => {
	console.log('server started');
});

// const express = require('express');
// const router = express.Router();
