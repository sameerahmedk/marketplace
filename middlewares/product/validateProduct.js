const { body, validationResult } = require('express-validator')

const validateProduct = [
  body('*.name', 'Product name is required').trim().isLength({ min: 1 }),
  body('*.unitPrice', 'Price must be a number').isFloat(),
  body('*.description', 'Description must not exceed 200 characters')
    .optional({ checkFalsy: true })
    .isLength({ max: 200 }),
  body('*.category', 'Category must not exceed 50 characters')
    .optional({ checkFalsy: true })
    .isLength({ max: 50 }),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const validatedProducts = req.body.map((product) => ({
      name: product.name,
      unitPrice: product.unitPrice,
      description: product.description,
      category: product.category,
      image: product.image,
      quantity: product.quantity,
      discount: product.discount,
      variations: product.variations,
      brand: product.brand
    }))

    req.validatedProducts = validatedProducts
    next()
  }
]

module.exports = { validateProduct }
