const express = require("express")
const authRouter = express.Router()
const User = require("../models/user")

// Login request and response logic from database
authRouter.post("/login", (req, res) => {
    // Will find if inputted username is in the database
    User.findOne({ username: req.body.username.toLowerCase()}, (err, user) => {
        if(err) return res.status(500).send(err)
        // Error message to send if the username is not in the database
        if(!user) return res.status(403).send({ success: false, err: "Email or password are incorrect"})
        // Upon successfully finding that username is in the database, we will now see if 
        // inputted password matches with user in the database
        user.checkPassword(req.body.password, (err, isMatch) => {
            if(err) return res.status(500).send(err)
            // Error message to send if password is not registered with user in the database
            if(!isMatch) return res.status(401).send({ success: false, err: "Email or password are incorrect"})
            // Upon seeing that password matches with the database, a token will be generated
            const token = jwt.sign(user.toObject(), process.env.SECRET)
            // Success response sent back to the client with token and 
            // user info (without the password) to store in browser local storage
            return res.send({token, user: user.withoutPassword(), success: true})
        })
    })
})

module.exports = authRouter