const mongoose = require('mongoose')
const Product = require('./product')

const { Schema } = mongoose

const orderProductSchema = new Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productPrice: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function (val) {
        return val > 0
      },
      message: 'Product price must be greater than zero'
    }
  },
  productQuantity: {
    type: Number,
    required: true,
    min: 1
  },
  selectedOptions: [String] // Array to store selected variation options
})

const orderSchema = new Schema({
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
  status: {
    type: String,
    enum: ['pending', 'accepted', 'delivered', 'cancelled'],
    default: 'pending'
  },
  products: [orderProductSchema],
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function (val) {
        return val >= 0
      },
      message: 'Total price must not be negative'
    }
  }
})

// Calculate the final price of the order by applying discounts and variation options
orderSchema.methods.calculateFinalPrice = async function () {
  const order = this

  // Iterate over each product in the order
  for (const product of order.products) {
    const { productId, productPrice, productQuantity, selectedOptions } =
      product

    // Retrieve the product from the database
    const selectedProduct = await Product.findById(productId)

    // Check if the selected variation quantity is sufficient
    const selectedVariation = selectedProduct.variations.find(
      (variation) => variation._id.toString() === selectedOptions.variationId
    )

    const selectedOption = selectedVariation.options.find(
      (option) => option.option === selectedOptions.option
    )

    if (selectedOption.quantity < productQuantity) {
      // Selected variation quantity is not enough
      throw new Error('Insufficient quantity for the selected variation.')
    }

    // Calculate the final price based on quantity and selected options
    let finalPrice = productPrice * productQuantity

    // Apply maximum applicable discount if available
    let applicableDiscount = 0
    for (const discount of selectedProduct.discount) {
      if (productQuantity >= discount.quantity) {
        applicableDiscount = discount.percentage
      } else {
        break // Stop checking further discounts
      }
    }

    // Calculate the discount amount and apply it to the final price
    if (applicableDiscount > 0) {
      const discountAmount = (productPrice * applicableDiscount) / 100
      finalPrice -= discountAmount
    }

    // Update the final price in the order product
    product.finalPrice = finalPrice

    // You can also update the selectedOptions property if needed
    product.selectedOptions = selectedOptions
  }

  // Calculate the total price of the order
  order.totalPrice = order.products.reduce(
    (sum, product) => sum + product.finalPrice,
    0
  )

  await order.save()
}

module.exports = mongoose.model('Order', orderSchema)
