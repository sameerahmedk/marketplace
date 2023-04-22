const mongoose = require('mongoose')
const { randomUUID } = require('crypto')

const orderSchema = new mongoose.Schema({
  order_id: {
    type: String,
    default: randomUUID(),
    unique: true,
    required: true
  },
  retailer_id: {
    type: mongoose.Schema.Types.String,
    required: true,
    ref: 'Retailer.retailer_id'
  },
  supplier_id: {
    type: mongoose.Schema.Types.String,
    required: true,
    ref: 'Supplier.supplier_id'
  },
  products: [
    {
      ref: 'Product.product_id',
      ref: 'Product.product_price',
      product_quantity: Number
    }
  ],
  total_price: Double
})

module.exports = mongoose.model('Order', orderSchema)
