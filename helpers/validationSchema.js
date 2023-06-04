const Joi = require('joi')

// const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/

const authSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().lowercase().required(),
  // password: Joi.string().pattern(passwordRegex).required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().required().valid('supplier', 'retailer'),
  contact_number: Joi.string().required(),
  cnic: Joi.string()
})

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  // password: Joi.string().pattern(passwordRegex).required()
  password: Joi.string().min(8).required()
})

module.exports = {
  authSchema,
  loginSchema
}
