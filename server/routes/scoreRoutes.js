const express = require("express");
const scoreRouter = express.Router();
const Score = require("../models/scores");

scoreRouter.route("/")
  .get((req, res) => {
    Score.find({user: req.user._id}, (err, text) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(text);
    });
  })

  .post((req, res) => {
    const newScore = new Score(req.body);
    newScore.user = req.user._id
    newScore.save((err, newScore) => {
      if (err) return res.status(500).send(err);
      return res.status(201).send(newScore);
    });
  });

scoreRouter.route("/:id").delete((req, res) => {
  Score.findOneAndRemove({ _id: req.params.id, user: req.user._id }, (err, deletedScore) => {
    if (err) return res.status(500).send(err);
    return res
      .status(201)
      .send({
        deletedScore: deletedScore,
        message: "Score successfully removed"
      });
  });
});

module.exports = scoreRouter