const express = require("express")
const authRouter = express.Router()
const User = require("../models/user")

authRouter.post("/login", (req, res) => {
    User.findOne({ username: req.body.username.toLowerCase()}, (err, user) => {
        if(err) return res.status(500).send(err)
        if(!user) return res.status(403).send({ success: false, err: "Email or password are incorrect"})
        user.checkPassword(req.body.password, (err, isMatch) => {
            if(err) return res.status(500).send(err)
            if(!isMatch) return res.status(401).send({ success: false, err: "Email or password are incorrect"})
            const token = jwt.sign(user.toObject(), process.env.SECRET)
            return res.send({token, user: user.withoutPassword(), success: true})
        })
    })
})

module.exports = authRouter