const express = require("express");
const cityScoresRouter = express.Router();
const cityScore = require("../models/cityScores");

cityScoresRouter.route("/")
  .get((req, res) => {
    cityScore.find({user: req.user._id}, (err, text) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(text);
    });
  })

  .post((req, res) => {
    const newScore = new cityScore(req.body);
    newScore.user = req.user._id
    newScore.save((err, newScore) => {
      if (err) return res.status(500).send(err);
      return res.status(201).send(newScore);
    });
  });

cityScoresRouter.route("/:id").delete((req, res) => {
  cityScore.findOneAndRemove({ _id: req.params.id, user: req.user._id }, (err, deletedScore) => {
    if (err) return res.status(500).send(err);
    return res
      .status(201)
      .send({
        deletedScore: deletedScore,
        message: "cityScore successfully removed"
      });
  });
});

module.exports = cityScoresRouter