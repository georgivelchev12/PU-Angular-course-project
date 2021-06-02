const express = require("express");
const mongoose = require("mongoose");

const coursesRoutes = require("./routes/courses");
const userRoutes = require("./routes/user");

const app = express();

(async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://gVelchev:${process.env.MONGO_ATLAS_PW}@cluster0.k3dfj.azure.mongodb.net/KnowledgeBridge?retryWrites=true&w=majority`,
      { useUnifiedTopology: true, useNewUrlParser: true }
    );
    console.log("Connected to database!");
  } catch (err) {
    console.log("Failed to connect!");
  }
})();

app.use(express.json());
// Its used to be able to have objects in arrays
app.use(express.urlencoded({ extended: true }));

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

app.use("/courses-project/images", express.static(`${process.env.BACKEND_IMAGE_FOLDER ? process.env.BACKEND_IMAGE_FOLDER : ""}images`));
app.use("/courses-project/api/user", userRoutes);
app.use("/courses-project/api/courses", coursesRoutes);

module.exports = app;
