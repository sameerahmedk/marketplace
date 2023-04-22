const express = require('express')
const router = express.Router()

const Supplier = require('../models/supplier')

// Create a new supplier
router.post('/', async (req, res) => {
  try {
    const supplier = new Supplier(req.body)
    await supplier.save()
    res.status(201).json(supplier)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Get all suppliers
router.get('/', async (req, res) => {
  try {
    //console.log("ABBASI")
    const suppliers = await Supplier.find()
    res.json(suppliers)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get a single supplier
router.get('/:id', getSupplier, (req, res) => {
  res.json(res.supplier)
})

// Update a supplier
router.patch('/:id', getSupplier, async (req, res) => {
  if (req.body.User_ID != null) {
    res.supplier.User_ID = req.body.User_ID
  }
  if (req.body.Address != null) {
    res.supplier.Address = req.body.Address
  }
  if (req.body.City != null) {
    res.supplier.City = req.body.City
  }
  if (req.body.Country != null) {
    res.supplier.Country = req.body.Country
  }
  if (req.body.NIC != null) {
    res.supplier.NIC = req.body.NIC
  }
  if (req.body.IBAN != null) {
    res.supplier.IBAN = req.body.IBAN
  }
  try {
    const updatedSupplier = await res.supplier.save()
    res.json(updatedSupplier)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Delete a supplier
router.delete('/:id', getSupplier, async (req, res) => {
  try {
    await res.supplier.remove()
    res.json({ message: 'Supplier deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Middleware function to get a single supplier by ID
async function getSupplier(req, res, next) {
  let supplier
  try {
    supplier = await Supplier.findById(req.params.id)
    if (supplier == null) {
      return res.status(404).json({ message: 'Cannot find supplier' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
  res.supplier = supplier
  next()
}

module.exports = router
