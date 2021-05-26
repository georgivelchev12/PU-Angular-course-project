const express = require("express");
const router = express.Router();

// Middlewares
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');
const PostsController = require("../controllers/posts");

router.post("", checkAuth, extractFile, PostsController.createPost);
router.put("/:id", checkAuth, extractFile, PostsController.editPost);
router.get("/:id", PostsController.getPost);
router.delete("/:id", checkAuth, PostsController.deletePost);
router.get("", PostsController.getPosts);

module.exports = router;