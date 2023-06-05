const { body, validationResult } = require('express-validator')

const validateProduct = [
  body('name', 'Product name is required').trim().isLength({ min: 1 }),
  body('unitPrice', 'Price must be a number').isFloat(),
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
      unitPrice: req.body.unitPrice,
      description: req.body.description,
      category: req.body.category,
      image: req.body.image,
      quantity: req.body.quantity,
      discount: req.body.discount,
      variations: req.body.variations,
      brand: req.body.brand
    }

    next()
  }
]

module.exports = { validateProduct }
