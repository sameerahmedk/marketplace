const express = require('express')
const router = express.Router()
const { verifyAccessToken } = require('../helpers/jwtHelper')
const Product = require('../models/product')
const getProduct = require('../middlewares/product/getProduct')
const { validateProduct } = require('../middlewares/validateProduct')

// Create a product
router.post('/', verifyAccessToken, validateProduct, async (req, res, next) => {
  try {
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
router.get('/:id', verifyAccessToken, getProduct, async (req, res, next) => {
  try {
    res.json(req.product)
  } catch (err) {
    next(err)
  }
})

// Update a product
router.put(
  '/:id',
  verifyAccessToken,
  getProduct,
  validateProduct,
  async (req, res, next) => {
    try {
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
router.delete('/:id', verifyAccessToken, getProduct, async (req, res, next) => {
  try {
    await req.product.remove()
    res.json({ message: 'Product deleted' })
  } catch (err) {
    next(err)
  }
})

module.exports = router
