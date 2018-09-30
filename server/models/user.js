const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema ({
    username: {
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

// Going to save a 'hook' to the encrypted password before saving the new user's info
userSchema.pre("save", function(next){
    const user = this
    if(!user.isModified("password")) return next()
    bcrypt.hash(user.password, 10, function(err, hash){
        if(err) return next(err)
        user.password = hash
        next()
    })
})

// Going to check the decrypted password with the user's password attempt
userSchema.methods.checkPassword = function(passwordAttempt, callback){
    bcrypt.compare(passwordAttempt, this.password, function(err, isMatch){
        if(err) return callback(err)
        callback(null, isMatch)
    })
}

// Function to remove the user's password from the object being sent off to the client
userSchema.methods.withoutPassword = function(){
    const user = this.toObject()
    delete user.password
    return user
}

module.exports = mongoose.model('User', userSchema)