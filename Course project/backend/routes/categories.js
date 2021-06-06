const router = require("express").Router();

const { getCategories } = require("../controllers/categories");

router.get("", getCategories);

module.exports = router;