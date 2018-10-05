const express = require("express");
const profileRoutes = express.Router();
const expressJwt = require("express-jwt");
const User = require("../models/user");

profileRoutes.use(expressJwt({ secret: process.env.SECRET }));

profileRoutes.get("/", (req, res) => {
  User.findOne({ _id: req.user._id }, (err, user) => {
    if (err)
      return res.status(500).send({ success: false, err: "User not found" });
    if (user === null)
      return res.status(400).send({ success: false, err: "User not found" });
    return res
      .status(200)
      .send({ success: true, user: user.withoutPassword() });
  });
});

module.exports = profileRoutes;
