const mongoose = require('mongoose')
const { Schema } = mongoose

const productSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  supplier: {
    type: Schema.Types.ObjectId,
    ref: 'User._id',
    required: true
  },
  name: {
    type: Schema.Types.String,
    required: true
  },
  description: {
    type: Schema.Types.String,
    required: true
  },
  unitPrice: {
    type: Schema.Types.Number,
    required: true,
    min: 0,
    max: 100000
  },
  category: {
    type: Schema.Types.String,
    required: true
  },
  brand: {
    type: Schema.Types.String,
    required: true
  },
  quantity: {
    type: Schema.Types.Number,
    required: true,
    min: 0,
    max: 10000
  },
  image: {
    type: Schema.Types.String,
    required: [true, 'image is required'],
    validate: {
      validator: (v) => {
        return /\.(jpe?g|png|gif|bmp)$/i.test(v)
      },
      message: 'invalid image file format'
    }
  }
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product
