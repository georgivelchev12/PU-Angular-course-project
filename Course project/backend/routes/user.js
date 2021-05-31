const express = require('express');
const router = express.Router();

const checkAuth = require("../middleware/check-auth")
const UserController = require("../controllers/user")

router.post('/signup', UserController.createUser)
router.post('/login', UserController.loginUser)
router.get('/list', checkAuth, UserController.listUsers)
router.put('/:id', checkAuth, UserController.disableUser)
router.put('/restore-user/:id', checkAuth, UserController.restoreUser)
router.delete('/:id', checkAuth, UserController.deleteUser)

router.get('/my-profile/', checkAuth, UserController.getMyAccount)

// to do ...
router.put('/my-profile/change-names', checkAuth, UserController.changeNames)

module.exports = router;


