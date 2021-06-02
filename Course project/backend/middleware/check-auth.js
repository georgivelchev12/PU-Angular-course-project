const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    await jwt.verify(token, process.env.JWT_KEY);
    // Set request information for user
    req.userId = jwt.decode(token).userId;
    req.email = jwt.decode(token).email;
    req.role = jwt.decode(token).role;

    next();
  } catch (error) {
    res.status(401).json({ message: "You are not authenticated!" });
  }
};
