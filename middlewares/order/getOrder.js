const Order = require('../../models/order')

/**
 * Middleware function to get a single order by ID
 */
async function getOrder(req, res, next) {
  let order
  try {
    order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
  } catch (err) {
    next(err)
  }
  res.order = order
  next()
}

module.exports = getOrder
