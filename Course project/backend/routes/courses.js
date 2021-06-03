const router = require("express").Router();

// Middlewares
const extractFile = require("../middleware/file");
const checkAuth = require("../middleware/check-auth");

const { getCourses, getCourse, createCourse, editCourse, deleteCourse } = require("../controllers/courses");
// /api/knowledgebridge
router.get("", getCourses);
router.get("/:id", getCourse);
router.post("", checkAuth, extractFile, createCourse);
router.put("/:id", checkAuth, extractFile, editCourse);
router.delete("/:id", deleteCourse);

module.exports = router;