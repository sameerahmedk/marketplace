const Product = require('../../models/product')

async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.body.order.productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    req.product = product
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = getProduct
