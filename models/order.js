const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  retailerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    index: true
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    index: true
  },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      productPrice: {
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
      productQuantity: {
        type: Number,
        required: true,
        min: 0
      }
    }
  ],
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
    validate: [
      {
        validator: function (val) {
          return val >= 0
        },
        message: 'Total price must not be negative'
      }
    ]
  }
})

module.exports = mongoose.model('Order', orderSchema)
