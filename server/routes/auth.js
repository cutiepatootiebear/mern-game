const express = require("express");
const authRouter = express.Router();
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

// Login
authRouter.post("/login", (req, res) => {
  User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
    if (err) return res.status(500).send({ success: false, err: "Email or password are incorrect" });
    if (!user) {
      return res
        .status(403)
        .send({ success: false, err: "Email or password are incorrect" });
    }
    user.checkPassword(req.body.password, (err, isMatch) => {
      if (err) return res.status(500).send({ success: false, err: "Email or password are incorrect" });
      if (!isMatch)
        return res
          .status(401)
          .send({ success: false, err: "Email or password are incorrect" });
      const token = jwt.sign(user.toObject(), process.env.SECRET);
      return res.send({ token, user: user.withoutPassword(), success: true });
    });
  });
});

// Sign Up
authRouter.post("/signup", (req, res) => {
  User.findOne({ username: req.body.username }, (err, existingUser) => {
    if (err) return res.status(500).send({ success: false, err: "That username is already taken" });
    // if db doesn't retrun null = there's already a user with the same userName
    if (existingUser !== null) {
      return res
        .status(400)
        .send({ success: false, err: "Username is already taken" });
    }
    // Create new user in DB
    const newUser = new User(req.body);
    newUser.save((err, user) => {
      if (err) return res.status(500).send({ success: false, err: "Error in the database" });
      // give user a token
      const token = jwt.sign(user.toObject(), process.env.SECRET);
      return res
        .status(201)
        .send({ success: true, user: user.withoutPassword(), token });
    });
  });
});

// GET all users
authRouter.route("/")
  .get((req, res) => {
    User.find((err, text) => {
      if (err) return res.status(500).send({ success: false, err: "Not able to get users" });
      return res.status(200).send(text);
    })
  })
  
  // Delete all
  .delete((req, res) => {
    User.remove((err, text) => {
      if (err) return res.status(500).send({ success: false, err: "Unable to delete" });
      return res.status(200).send(text);
    });
  });


// DELETE a user
authRouter.route("/:id").delete((req, res) => {
  User.findOneAndRemove({ _id: req.params.id }, (err, deletedUser) => {
    if (err) return res.status(500).send({ success: false, err: "Unable to delete. User might not exist."});
    return res.status(201).send({
      deletedUser: deletedUser,
      message: "User successfully removed"
    });
  });
});

module.exports = authRouter;
