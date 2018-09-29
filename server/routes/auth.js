const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");

authRouter.post("/signup", (req, res) => {
  User.findOne({ username: req.body.username }, (err, existingUser) => {
    if (err) return res.status(500).send({ success: false, err });
    // if db doesn't retrun null = there's already a user with the same userName
    if (existingUser !== null) {
      return res
        .status(400)
        .send({ success: false, err: "Username is already taken" });
    }
    // Create new user in DB
    const newUser = new User(req.body);
    newUser.save((err, user) => {
      if (err) return res.status(500).send({ success: false, err });
      // give user a token
      const token = jwt.sign(user.toObject(), process.env.SECRET);
      return res
        .status(201)
        .send({ success: false, user: user.toObject(), token });
    });
  });
});
