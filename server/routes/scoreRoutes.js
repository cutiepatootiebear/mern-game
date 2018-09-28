const express = require('express')
const scoreRouter = express.Router()
const Score = require('../models/scores')

scoreRouter.route('/')
    .get((req, res) => {
        Score.find((err, text) => {
            if(err) return res.status(500).send(err)
            return res.status(200).send(text)
        })
    })

    .post((req, res) => {
        const newScore = new Score(req.body)
        newScore.save((err, savedScore) => {
            if(err) return res.status(500).send(err)
            return res.status(201).send(savedScore)
        })
    })

    scoreRouter.route('/:id')
        .delete((req, res) => {
            Score.findOneAndRemove({ _id: req.params.id }, (err, deletedScore) => {
                if(err) return res.status(500).send(err)
                return res.status(202).send({ deletedScore: deletedScore, message: "Score successfully removed"})
            })
        })

module.exports = scoreRouter