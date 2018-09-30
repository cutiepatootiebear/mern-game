const express = require("express");
const morgan = require("morgan");
const app = express();
require("dotenv").config()
const mongoose = require("mongoose");
const PORT = process.env.PORT || 8080;
const scoreRoutes = require("./routes/scoreRoutes")
const authRoute = require("./routes/auth")

// Middlwares to be used on every request that comes into the server
app.use(morgan("dev"));
app.use(express.json());

// Connects to Mongodb on your local hard drive to save your db
mongoose
  .connect(
    "mongodb://localhost:27017/mern-game",
    { useNewUrlParser: true },
    () => {
      console.log("Connected to the database");
    }
  )
  .catch(err => {
    console.log(err);
  });

  app.use("/api", expressJwt({secret: process.env.SECRET}))

// The first argument is the endpoint that triggers this middleware
// The second argument is what routes to use when the endpoint is
// requested by a front end
// app.use("/games", gameRoutes);
// app.use("/", require("./routes/scoreRoutes"));

// One route to take for authentication
app.use("/auth", authRoute)
// Another route for allowing the authorized user to post a score
app.use("api/post-score", scoreRoutes)


app.listen(PORT, () => {
  console.log(`Server is running port ${PORT}`);
});
