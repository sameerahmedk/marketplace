const express = require('express')
const router = express.Router()
const { verifyAccessToken } = require('../helpers/jwtHelper')
const Order = require('../models/order')
const getProduct = require('../middlewares/product/getProduct')
const getOrder = require('../middlewares/order/getOrder')
const Product = require('../models/product')

/**
 * Place an order
 */
router.post('/', verifyAccessToken, getProduct, async (req, res, next) => {
  try {
    const order = new Order({
      retailerId: req.user.id,
      supplierId: req.product.supplier,
      productId: req.body.order.productId,
      productPrice: req.body.order.productPrice,
      productQuantity: req.body.order.productQuantity,
      selectedOptions: req.body.order.selectedOptions,
      totalPrice: req.body.order.totalPrice
    })

    // Reduce the product quantity
    const { productId, selectedOptions, productQuantity } = req.body.order
    await reduceProductQuantity(productId, selectedOptions, productQuantity)

    await order.save()
    res.status(201).json(order)
  } catch (err) {
    next(err)
  }
})

/**
 * Get all orders by the logged in user
 */
const UserRole = {
  SUPPLIER: 'supplier',
  RETAILER: 'retailer'
}

router.get('/', verifyAccessToken, async (req, res, next) => {
  try {
    const { role, userId } = req.user

    switch (role) {
      case UserRole.SUPPLIER: {
        const supplierOrders = await Order.find({ supplierId: userId })
        res.json(supplierOrders)
        break
      }
      case UserRole.RETAILER: {
        const retailerOrders = await Order.find({ retailerId: userId })
        res.json(retailerOrders)
        break
      }
      default:
        throw new Error('Invalid user role')
    }
  } catch (error) {
    next(error)
  }
})

/**
 * Get a specific order
 */
router.get('/:id', verifyAccessToken, getOrder, (req, res) => {
  res.json(res.order)
})

/**
 * Update order status
 */
router.put('/:id/status', async (req, res, next) => {
  const { id } = req.params
  const { status } = req.body

  try {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true })

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    res.json({ message: 'Order status updated to:', status })
  } catch (error) {
    next(error)
  }
})

/**
 * Update order
 */
router.patch('/:id', verifyAccessToken, getOrder, async (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: 'No fields provided to update' })
    }

    const { order } = res
    Object.assign(order, req.body)

    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } catch (err) {
    next(err)
  }
})

/**
 * Delete an order
 */
router.delete('/:id', verifyAccessToken, getOrder, async (req, res, next) => {
  try {
    await res.order.remove()
    res.json({ message: 'Order deleted' })
  } catch (err) {
    next(err)
  }
})

async function reduceProductQuantity(productId, selectedOption, quantity) {
  const product = await Product.findById(productId)

  // console.log('product', product)
  console.log('selectedOption', selectedOption)
  console.log('product.variations', product.variations)

  // Find the variation option with the selected option
  const variationOption = product.variations.find(
    (option) => option.option === selectedOption
  )

  // // Check if the variation option exists and has sufficient quantity
  // if (!variationOption || variationOption.quantity < quantity) {
  //   throw new Error('Insufficient quantity for the selected option')
  // }

  // console.log('variationOption', variationOption)
  // Reduce the quantity of the selected option
  variationOption.quantity -= quantity

  // Save the updated product
  await product.save()
}

module.exports = router
