const mongoose = require("mongoose");

const retailerSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    ref: "User.user_id",
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  nic: {
    type: String,
    required: true,
    unique: true,
  },
});

const Retailer = mongoose.model("Retailer", retailerSchema);

module.exports = Retailer;
