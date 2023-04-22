const mongoose = require('mongoose')

const supplierSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    ref: 'User.user_id'
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  nic: {
    type: String,
    required: true,
    unique: true
  },
  iban: {
    type: String,
    required: true
  }
})

const Supplier = mongoose.model('Supplier', supplierSchema)

module.exports = Supplier
