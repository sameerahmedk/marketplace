const express = require('express')
const router = express.Router()
const { verifyAccessToken } = require('../helpers/jwtHelper')
const Order = require('../models/order')
const Retailer = require('../models/retailer')
const user = require('../models/user')

// Place order
router.post('/', verifyAccessToken, async (req, res) => {
  try {
    const order = new Order(req.body)
    await order.save()
    res.status(201).json(order)
  } catch (err) {
    next(err)
  }
})

// Get all orders by the logged in user
router.get('/', verifyAccessToken, async (req, res) => {
  try {
    user_id = req.user.user_id
    const orders = await Order.find({
      $or: [{ supplier_id: user_id }, { retailer_id: user_id }]
    })
    res.json(orders)
  } catch (err) {
    next(err)
  }
})

// Get a specific order
router.get('/:id', verifyAccessToken, getOrder, (req, res) => {
  res.json(res.order)
})

// Update order
router.patch('/:id', verifyAccessToken, getOrder, async (req, res) => {
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
  try {
    const updatedorder = await res.order.save()
    res.json(updatedorder)
  } catch (err) {
    next(err)
  }
})

// Delete an order
router.delete('/:id', verifyAccessToken, getOrder, async (req, res) => {
  try {
    await res.order.remove()
    res.json({ message: 'Order deleted' })
  } catch (err) {
    next(err)
  }
})

// Middleware function to get a single order by ID
async function getOrder(req, res, next) {
  let order
  try {
    order = await Order.findOne({
      order_id: req.params.id
    })
    if (order == null) {
      return res.status(404).json({ message: 'Cannot find order' })
    }
  } catch (err) {
    next(err)
  }
  res.order = order
  next()
}

module.exports = router
