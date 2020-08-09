// Import dependencies for server file
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

// Declare server
const server = express();

// Connect to collection
mongoose.connect(process.env.URL, {
  // You need to set up a cluster on MongoDB
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// Import middleware

// Import Routes
const usersRoute = require("./Routes/users-route");

// Invoke dependencies
server.use(express.json());
server.use(helmet());
server.use(
  cors({
    origin: "*",
    // allows headers to be read
    credentials: true,
  })
);

// Connect Routes
server.use("/users", usersRoute);

module.exports = server;
