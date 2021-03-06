const fs = require("fs");
const Category = require("../models/category");
const Course = require("../models/course");
const user = require("../models/user");

// Removes empty strings, in our case remove arr strings generated by formData obj
const filterEmptyArr = (arr) => arr.filter((el) => el !== "");

exports.getCourse = async (req, res, next) => {
  // execPopulate because we don't have callback
  const course = await Course.findById({ _id: req.params.id })
    .populate("categories", "title")
    .lean();
  // course.categories = course.categories.map(c => c.title);
  // course.categories.push(await Category.findById('60bbd945cee27d1ae4adba51'))

  console.log(course);
  res.status(200).json({
    message: "Course fetched successfully!",
    courses: [course],
  });
};

exports.getCourses = async (req, res, next) => {
  const courses = await Course.find();
  res.status(200).json({
    message: "Courses fetched successfully!",
    courses,
  });
};

exports.createCourse = async (req, res, next) => {
  const siteUrl = req.protocol + "://" + req.get("host");
  const imgFile = siteUrl + "/courses-project/images/" + req.file.filename;

  const course = new Course({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    imgFile: imgFile,
    date: req.body.date,
    likes: JSON.parse(req.body.likes),
    rating: JSON.parse(req.body.rating),
    categories: JSON.parse(req.body.categories),
  });

  course.likes = filterEmptyArr(course.likes);
  course.rating = filterEmptyArr(course.rating);
  course.categories = filterEmptyArr(course.categories);

  await course.save((err) => {
    if (err) {
      console.log(`Something went wrong: ${err.message}`);
      return;
    }
    res.status(201).json({ message: "Post added successfully" });
  });
};

exports.editCourse = async (req, res, next) => {
  let imgFile = req.body.imgFile;
  if (req.file) {
    const siteUrl = req.protocol + "://" + req.get("host");
    imgFile = siteUrl + "/courses-project/images/" + req.file.filename;
  }

  // Fetched
  // Convert id to _id and update post
  const course = new Course({
    _id: req.body.id,
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    imgFile: imgFile,
    date: req.body.date,
    likes: filterEmptyArr(JSON.parse(req.body.likes)),
    rating: filterEmptyArr(JSON.parse(req.body.rating)),
    categories: await Category.find({
      _id: filterEmptyArr(JSON.parse(req.body.categories) || []),
    }),
  });

  // Get already created course and compare it with request course
  const foundCourse = await Course.findOne({ _id: req.params.id });

  //   To do .... make it with populate(...)
  // Check ratings
  if (
    foundCourse.rating.find((obj) => obj.email == req.email) !== undefined &&
    JSON.stringify(foundCourse.rating) != JSON.stringify(course.rating)
  ) {
    res.status(409).json({ message: "You already rated this course!" });
    return;
  }
  // If rate is less than 1 and more than 5 show error
  if (
    course.rating.find((item) => !(item.rate >= 1 && item.rate <= 5)) !==
    undefined
  ) {
    res.status(409).json({ message: "Your rate must be between 1 and 5" });
    return;
  }

  // Get file name from splited url
  // If image update then delete old one if not keep it in database
  let fileName, path;
  if (req.file) {
    fileName =
      foundCourse.imgFile.split("/")[foundCourse.imgFile.split("/").length - 1];
    path =
      `${
        process.env.BACKEND_IMAGE_FOLDER ? process.env.BACKEND_IMAGE_FOLDER : ""
      }images/` + fileName;
  }

  try {
    await Course.updateOne({ _id: req.params.id }, course);
    // fs.access return undefined if its valid so we check opposite for correct results
    if (await fs.existsSync(path)) {
      await fs.promises.unlink(path);
    }
    res.status(200).json({ message: "Update successful!" });
  } catch (err) {
    console.log("EDIT function - Something went wrong: " + err);
  }
};

exports.deleteCourse = async (req, res, next) => {
  const foundCourse = await Course.findOne({ _id: req.params.id });

  // Get file name from splited url
  let fileName =
    foundCourse.imgFile.split("/")[foundCourse.imgFile.split("/").length - 1];
  let path =
    `${
      process.env.BACKEND_IMAGE_FOLDER ? process.env.BACKEND_IMAGE_FOLDER : ""
    }images/` + fileName;

  try {
    if (await fs.existsSync(path)) {
      await fs.promises.unlink(path);
    }
    await Course.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Post deleted!" });
  } catch (err) {
    console.log(`Something went wrong: ${err}`);
  }
};
