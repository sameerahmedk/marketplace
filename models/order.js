const mongoose = require('mongoose')
const { v4: uuid } = require('uuid')

const orderSchema = new mongoose.Schema({
  _id: {
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
      product_price: {
        type: Number,
        required: true,
        min: 0,
        validate: [
          {
            validator: function (val) {
              return val > 0
            },
            message: 'Product price must be greater than zero'
          }
        ]
      },
      product_quantity: {
        type: Number,
        required: true,
        min: 0
      }
    }
  ],
  total_price: {
    type: Number,
    required: true,
    min: 0,
    validate: [
      {
        validator: function (val) {
          return val >= 0
        },
        message: 'Total price must be positive'
      }
    ]
  }
})

module.exports = mongoose.model('Order', orderSchema)
