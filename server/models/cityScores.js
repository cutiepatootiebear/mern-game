const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cityScoreSchema = new Schema ({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    score: Number
})

module.exports = mongoose.model('CityScore', cityScoreSchema)