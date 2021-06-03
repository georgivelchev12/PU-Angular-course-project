const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");
const {
  createUser,
  loginUser,
  listUsers,
  disableUser,
  restoreUser,
  deleteUser,
  getMyAccount,
  changeNames,
} = require("../controllers/user");

router.post("/signup", createUser);
router.post("/login", loginUser);
router.get("/list", checkAuth, listUsers);
router.put("/:id", checkAuth, disableUser);
router.put("/restore-user/:id", checkAuth, restoreUser);
router.delete("/:id", checkAuth, deleteUser);
router.get("/my-profile/", checkAuth, getMyAccount);

// to do ...
router.put("/my-profile/change-names", checkAuth, changeNames);

module.exports = router;
