const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const productSchema = new mongoose.Schema({
	productId: {
		type: String,
		default: randomUUID(),
		required: true,
		unique: true,
	},
	supplierId: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	unit_price: {
		type: Number,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	brand: {
		type: String,
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
});

const Product = mongoose.model(
	'Product',
	productSchema
);

module.exports = Product;
