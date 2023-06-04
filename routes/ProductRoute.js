const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/auth')
const Product = require('../models/product')
const getProduct = require('../middlewares/product/getProduct')
const { validateProduct } = require('../middlewares/product/validateProduct')
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  verifyAccessToken
} = require('../helpers/jwtHelper')

// Create a product
router.post('/', verifyAccessToken, validateProduct, async (req, res, next) => {
  try {
    // Check if user role is supplier
    // if (req.user.role !== 'supplier') {
    //   return res.status(403).json({ message: 'Forbidden' })
    // }
    const product = new Product(req.validatedProduct)
    await product.save()
    res.status(201).json(product)
  } catch (err) {
    next(err)
  }
})

// Get all products
router.get('/', verifyAccessToken, async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10
    const skip = parseInt(req.query.skip) || 0
    const filter = req.query.filter || {}

    const products = await Product.find(filter).limit(limit).skip(skip)
    res.json(products)
  } catch (err) {
    next(err)
  }
})

// Get a single product
router.get('/:id', authMiddleware, getProduct, async (req, res, next) => {
  try {
    res.json(req.product)
  } catch (err) {
    next(err)
  }
})

// Update a product
router.put(
  '/:id',
  authMiddleware,
  getProduct,
  validateProduct,
  async (req, res, next) => {
    try {
      // Check if user role is supplier
      if (req.user.role !== 'supplier') {
        return res.status(403).json({ message: 'Forbidden' })
      }
      const { product, validatedProduct } = req
      const updates = validatedProduct

      Object.keys(updates).forEach((prop) => {
        if (Object.prototype.hasOwnProperty.call(product, prop)) {
          product[prop] = updates[prop]
        }
      })

      const updatedProduct = await product.save()
      res.json(updatedProduct)
    } catch (error) {
      next(error)
    }
  }
)

// Delete a product
router.delete('/:id', authMiddleware, async (req, res, next) => {
  // Check if user role is supplier
  // if (req.user.role !== 'supplier') {
  //   return res.status(403).json({ message: 'Forbidden' })
  // } //not neccessary because of the authMiddleware. logically not correct.
  //GetProduct nai use kar rahy ab hum is API mein
  try {
    // Find and remove the product from the database
    const productId = req.params.id

    const result = await Product.deleteOne({ _id: productId })
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Product not found' })
    }
    return res.json({ message: 'Product deleted successfully' })
  } catch (err) {
    next(err)
  }
})

module.exports = router
