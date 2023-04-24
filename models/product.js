const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0,
    max: 100000
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    max: 100000
  },
  discount: [
    {
      quantity: {
        type: Number,
        required: true,
        min: 0,
        max: 100000
      },
      percentage: {
        type: Number,
        required: true,
        min: 0,
        max: 50
      }
    }
  ],
  image: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /\.(jpe?g|png|gif|bmp)$/i.test(v)
      },
      message: 'invalid image file format'
    }
  }
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product
