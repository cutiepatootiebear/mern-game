const express = require("express");
const morgan = require("morgan");
const app = express();
const mongoose = require("mongoose");
const path = require('path')
const PORT = process.env.PORT || 8080;
const authRoute = require("./routes/auth");
const scoreRoutes = require("./routes/scoreRoutes");
const cityScoresRoutes = require("./routes/citiesScores");
const States = require("./routes/us-states");
require("dotenv").config();
const profileRoutes = require("./routes/profile");
const expressJwt = require("express-jwt");


// Middlwares to be used on every request that comes into the server
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "client", "build")))
// Connects to Mongodb on your local hard drive to save your db
mongoose
  .connect(process.env.MONGODB_URI ||
    "mongodb://localhost:27017/mern-game",

    { useNewUrlParser: true },
    () => {
      console.log("Connected to the database");
    }
  )
  .catch(err => {
    console.log(err);
  });

// The first argument is the endpoint that triggers this middleware
// The second argument is what routes to use when the endpoint is
// requested by a front end
app.use("/api", expressJwt({ secret: process.env.SECRET }));

app.use("/states", States);
app.use("/auth", authRoute);
app.use("/api/scores", scoreRoutes);
app.use("/api/city-scores", cityScoresRoutes);
app.use("/api/profile", profileRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"))
})

app.listen(PORT, () => {
  console.log(`Server is running port ${PORT}`);
});
