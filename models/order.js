const mongoose = require('mongoose')

const { Schema } = mongoose

const orderSchema = new Schema({
  retailerId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'delivered', 'cancelled'],
    default: 'pending'
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  supplierId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  productPrice: {
    type: Number,
    required: true,
    min: 0
  },
  productQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  selectedOptions: {
    type: [String],
    required: true
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  }
})

// Calculate the final price of the order by applying discounts and variation options
orderSchema.methods.calculateFinalPrice = async function () {
  const order = this

  const { productId, productPrice, productQuantity, selectedOptions } = order

  // Retrieve the product from the database
  const selectedProduct = await Product.findById(productId)

  // Check if the selected variation quantity is sufficient
  const selectedVariation = selectedProduct.variations.find(
    (variation) => variation.option === selectedOptions.option
  )

  if (selectedVariation.quantity < productQuantity) {
    // Selected variation quantity is not enough
    throw new Error('Insufficient quantity for the selected variation.')
  }

  // Reduce the quantity of the selected variation
  selectedVariation.quantity -= productQuantity

  // Save the updated product
  await selectedProduct.save()

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

  // Update the final price in the order
  order.totalPrice = finalPrice

  await order.save()
}
const Order = mongoose.model('Order', orderSchema)

module.exports = Order
