////// DEPENDENCIES //////

// get .env variables
require("dotenv").config();
// pull PORT from .env, give default value of 3000
const { PORT = 3000, MONGODB_URL } = process.env;
// import express
const express = require("express");
// create application object
const app = express();
// import mongoose
const mongoose = require("mongoose");
// import middleware
const cors = require("cors");
const morgan = require("morgan");

////// Database Connection //////
// Establish connection
mongoose.connect(MONGODB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
// Connection Events
mongoose.connection
  .on("open", () => console.log("Your are connected to mongoose"))
  .on("close", () => console.log("Your are disconnected from mongoose"))
  .on("error", (error) => console.log(error));

////// Models //////
const PeopleSchema = new mongoose.Schema ({
  name: String,
  image: String,
  title: String
});

const People = mongoose.model("People", PeopleSchema);

////// Middleware //////
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies

////// Routes //////
//create a test route
app.get("/", (req,res) => {
  res.send("hello world");
});

// PEOPLE INDEX ROUTE - DISPLAYS ALL PEOPLE
app.get("/people", async(req, res) => {
  try {
    res.json(await People.find({}));
  } catch (error) {
    res.status(400).json(error);
  }
})

// PEOPLE CREATE ROUTE
app.post("/people", async (req, res) => {
  try {
    res.json(await People.create(req.body));
  } catch (error) {
    res.status(400).json(error);
  }
});

// PEOPLE UPDATE ROUTE
app.put("/people/:id", async (req, res) => {
  try {
    // send all people
    res.json(
      await People.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// PEOPLE DELETE ROUTE
app.delete("/people/:id", async (req, res) => {
  try {
    res.json(await People.findByIdAndRemove(req.params.id));
  } catch (error) {
    res.status(400).json(error);
  }
})

////// Listener //////
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))