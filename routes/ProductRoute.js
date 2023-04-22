const express = require('express')
const router = express.Router()
const { verifyAccessToken } = require('../helpers/jwtHelper')
const Product = require('../models/product')

// Create a product
router.post('/', verifyAccessToken, async (req, res) => {
  try {
    const product = new Product(req.body)
    await product.save()
    res.status(201).json(product)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Get all products
router.get('/', verifyAccessToken, async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get a single product
router.get('/:id', verifyAccessToken, getProduct, (req, res) => {
  res.json(res.product)
})

// Update a product
router.patch('/:id', verifyAccessToken, getProduct, async (req, res) => {
  if (req.body.productId != null) {
    res.product.productId = req.body.productId
  }
  if (req.body.supplierId != null) {
    res.product.supplierId = req.body.supplierId
  }
  if (req.body.name != null) {
    res.product.name = req.body.name
  }
  if (req.body.description != null) {
    res.product.description = req.body.description
  }
  if (req.body.unit_price != null) {
    res.product.unit_price = req.body.unit_price
  }
  if (req.body.category != null) {
    res.product.category = req.body.category
  }
  if (req.body.brand != null) {
    res.product.brand = req.body.brand
  }
  if (req.body.quantity != null) {
    res.product.quantity = req.body.quantity
  }
  if (req.body.image != null) {
    res.product.image = req.body.image
  }
  try {
    const updatedProduct = await res.product.save()
    res.json(updatedProduct)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Delete a product
router.delete('/:id', verifyAccessToken, getProduct, async (req, res) => {
  try {
    await res.product.remove()
    res.json({ message: 'Product deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Middleware function to get a single product by ID
async function getProduct(req, res, next) {
  let product
  try {
    product = await Product.findById(req.params.id)
    if (product == null) {
      return res.status(404).json({ message: 'Cannot find product' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
  res.product = product
  next()
}

module.exports = router
