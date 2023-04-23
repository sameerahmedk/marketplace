const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { randomUUID } = require('crypto')
const { Schema } = mongoose

const userSchema = new mongoose.Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    default: randomUUID(),
    unique: true,
    required: true
  },
  name: {
    type: Schema.Types.String,
    required: true
  },
  email: {
    type: Schema.Types.String,
    required: true,
    lowercase: true,
    unique: true
  },
  password: {
    type: Schema.Types.String,
    required: true
  },
  role: {
    type: Schema.Types.String,
    enum: ['supplier', 'retailer'],
    required: true
  },
  contact_number: {
    type: Schema.Types.String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\+92-\d{3}-\d{7}$/.test(v)
      },
      message: (props) => `${props.value} is not a valid phone number!`
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    this.email = this.email.toLowerCase()
    next()
  } catch (error) {
    next(error)
  }
})

userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password)
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = mongoose.model('User', userSchema)
