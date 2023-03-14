 const mongoose = require('mongoose')
 const bcrypt = require('bcrypt')


 const userSchema = new mongoose.Schema({
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
    }
    
 })


userSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password, salt)
        //const hashedEmail = await bcrypt.hash(this.email, salt)
        //this.email = hashedEmail
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
        throw error
    }
}

/*userSchema.methods.isValidEmail = async function (email) {
    try {
        return await bcrypt.compare(email, this.email)
    } catch (error) {
        throw error
    }
}*/


 module.exports = mongoose.model('User', userSchema)