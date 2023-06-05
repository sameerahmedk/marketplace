const express = require('express')
const router = express.Router()
const { verifyAccessToken } = require('../helpers/jwtHelper')
const Order = require('../models/order')

const User = require('../models/user')
/**
 * Place an order
 */
router.post('/', verifyAccessToken, async (req, res, next) => {
  try {
    const order = new Order(req.body)
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
    // const { role, _id } = req.user
    const role = req.headers['role']
    const userId = req.headers['userid']

    console.log(role)
    console.log(userId)
    switch (role) {
      case UserRole.SUPPLIER: {
        const supplierOrders = await Order.find({ supplierId: userId })
        const supplierName = await User.findOne({ _id: userId })
        const supplierName2 = await supplierName.name
        console.log(supplierName)
        console.log(supplierName2)
        res.json({ supplierOrders, supplierName2 })
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
router.put('/:id/status', async (req, res) => {
  const { orderId } = req.params
  const { status } = req.body

  try {
    // Find the order by orderId
    const order = await Order.findById(orderId)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // Update the status of the order
    order.status = status
    await order.save()

    res.json({ message: 'Order status updated successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
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
    if (req.body.orderId != null) {
      res.order.orderId = req.body.orderId
    }
    if (req.body.supplierId != null) {
      res.order.supplierId = req.body.supplierId
    }
    if (req.body.name != null) {
      res.order.name = req.body.name
    }
    if (req.body.description != null) {
      res.order.description = req.body.description
    }
    if (req.body.unit_price != null) {
      res.order.unit_price = req.body.unit_price
    }
    if (req.body.category != null) {
      res.order.category = req.body.category
    }
    if (req.body.brand != null) {
      res.order.brand = req.body.brand
    }
    if (req.body.quantity != null) {
      res.order.quantity = req.body.quantity
    }
    if (req.body.image != null) {
      res.order.image = req.body.image
    }
    const updatedorder = await res.order.save()
    res.json(updatedorder)
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

/**
 * Middleware function to get a single order by ID
 */
async function getOrder(req, res, next) {
  let order
  try {
    order = await Order.findOne({
      _id: req.params.id
    })
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
  } catch (err) {
    next(err)
  }
  res.order = order
  next()
}

module.exports = router
