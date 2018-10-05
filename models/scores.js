const mongoose = require('mongoose')
const Schema = mongoose.Schema

const scoreSchema = new Schema ({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    score: Number
})

module.exports = mongoose.model('Score', scoreSchema)