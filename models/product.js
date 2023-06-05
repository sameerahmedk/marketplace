const mongoose = require('mongoose')

const { Schema } = mongoose

const discountSchema = new Schema({
  quantity: {
    type: Number,
    required: true,
    index: true
  },
  percentage: {
    type: Number,
    required: true,
    default: 0
  }
})

const variationOptionSchema = new Schema({
  option: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  quantity: {
    type: Number,
    default: 0
  }
})

const productSchema = new Schema({
  supplier: {
    type: Schema.Types.ObjectId,
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
    min: 0
  },
  category: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /\.(jpe?g|png|gif|bmp)$/i.test(v)
      },
      message: 'Invalid image file format'
    }
  },
  discount: [discountSchema],
  variations: [variationOptionSchema]
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product
