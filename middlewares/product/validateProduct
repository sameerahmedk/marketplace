const { body, validationResult } = require('express-validator')

const validateProduct = [
  body('name', 'Product name is required').trim().isLength({ min: 1 }),
  body('price', 'Price must be a number').isFloat(),
  body('description', 'Description must not exceed 200 characters')
    .optional({ checkFalsy: true })
    .isLength({ max: 200 }),
  body('category', 'Category must not exceed 50 characters')
    .optional({ checkFalsy: true })
    .isLength({ max: 50 }),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    req.validatedProduct = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category
    }

    next()
  }
]

module.exports = { validateProduct }
