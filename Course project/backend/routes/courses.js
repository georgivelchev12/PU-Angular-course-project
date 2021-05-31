const express = require("express");
const router = express.Router();

// Middlewares
const extractFile = require("../middleware/file");
const checkAuth = require("../middleware//check-auth");

const CoursesController = require("../controllers/courses");

// /api/knowledgebridge

router.get("", CoursesController.getCourses);
router.get("/:id", CoursesController.getCourse);

router.post("", checkAuth, extractFile, CoursesController.createCourse);
router.put("/:id", checkAuth, extractFile, CoursesController.editCourse);
router.delete("/:id", CoursesController.deleteCourse);


// //set a reference to the request module
// let request = require('request');
// //create an object to send as POST data

// //the config for our HTTP POST request
// let postConfig = {
//     url: 'http://localhost:5500/api/knowledgebridge',
//     form: {
//         'title': 'SomeShit',
//         'author': 'Georgi Velchev',
//         'description': 'Lorem ipsum 12',
//         'imgFile': 'someimgFile',
//         'date': '25/03/2021',
//         'likes': ['g.velchev12@gmail.com', 'test@test.com'],
//         'rating': [
//             { 'name': 'Georgi Velchev', 'rate': 5 },
//             { 'name': 'Dimitar Petrov', 'rate': 4 }
//         ],
//         'categories': ['Music', 'Something'],
//     }
// };

// //the HTTP POST request success handler
// let postSuccessHandler = function (err, httpResponse, body) {
//     //look for this message in your JS console:
//     console.log('JSON response from the server: ' + body);
// };

// //make the POST request
// request.post(postConfig, postSuccessHandler);



module.exports = router;