const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();

mongoose.connect("mongodb+srv://max:" + process.env.MONGO_ATLAS_PW + "@cluster0.e2jtb.mongodb.net/node-angular&w=majority", { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log('Connected to database!');
  }).catch(() => {
    console.log('Connection failed!');
  })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/posts-project/images", express.static(path.join(`${process.env.BACKEND_IMAGE_FOLDER ? process.env.BACKEND_IMAGE_FOLDER : ""}images`)));
app.use("/posts-project/api/user", userRoutes);
app.use("/posts-project/api/posts", postsRoutes);

module.exports = app;
