const Joi = require('@hapi/joi')

const authSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    //pwd must be ('^[a-zA-Z0-9]{3,30}$')
    password: Joi.string().min(8).required()
})

const loginSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    //pwd must be ('^[a-zA-Z0-9]{3,30}$')
    password: Joi.string().min(8).required()
})

module.exports = {
    authSchema,
    loginSchema
}