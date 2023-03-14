const express = require('express');
const router = express.Router();

const Retailer = require('../models/retailer');

// Create a new retailer
router.post('/', async (req, res) => {
  try {
    const retailer = new Retailer(req.body);
    await retailer.save();
    res.status(201).json(retailer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all retailers
router.get('/', async (req, res) => {
  try {
    const retailers = await Retailer.find();
    res.json(retailers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single retailer
router.get('/:id', getRetailer, (req, res) => {
  res.json(res.retailer);
});

// Update a retailer
router.patch('/:id', getRetailer, async (req, res) => {
  if (req.body.User_ID != null) {
    res.retailer.User_ID = req.body.User_ID;
  }
  if (req.body.Address != null) {
    res.retailer.Address = req.body.Address;
  }
  if (req.body.City != null) {
    res.retailer.City = req.body.City;
  }
  if (req.body.Country != null) {
    res.retailer.Country = req.body.Country;
  }
  if (req.body.NIC != null) {
    res.retailer.NIC = req.body.NIC;
  }
  try {
    const updatedRetailer = await res.retailer.save();
    res.json(updatedRetailer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a retailer
router.delete('/:id', getRetailer, async (req, res) => {
  try {
    await res.retailer.remove();
    res.json({ message: 'Retailer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get a single retailer by ID
async function getRetailer(req, res, next) {
  let retailer;
  try {
    retailer = await Retailer.findById(req.params.id);
    if (retailer == null) {
      return res.status(404).json({ message: 'Cannot find retailer' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.retailer = retailer;
  next();
}

module.exports = router;
