const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { randomUUID } = require('crypto')

const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    default: randomUUID(),
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: mongoose.Schema.Types.String,
    ref: 'Role.role_name',
    required: true
  },
  contact_number: { type: String, required: true }
})

userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
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
