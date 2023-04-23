const mongoose = require('mongoose')
const { v4: uuid } = require('uuid')

const orderSchema = new mongoose.Schema({
  order_id: {
    type: String,
    default: uuid,
    unique: true,
    required: true
  },
  retailer_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  supplier_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  products: [
    {
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      product_price: { type: Number, required: true },
      product_quantity: { type: Number, required: true }
    }
  ],
  total_price: {
    type: mongoose.Schema.Types.Number,
    required: true
  }
})

module.exports = mongoose.model('Order', orderSchema)
