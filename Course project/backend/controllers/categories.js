const Category = require("../models/category");

exports.getCategories = async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json({
    message: "Categories fetched successfully!",
    categories,
  });
};
