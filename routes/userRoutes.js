const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { verify, verifyAdmin, isLoggedIn } = require("../auth");

router.post('/register', userController.register);
router.post('/login', userController.login);

// Route for retreiving user details
router.get("/details", verify, userController.retrieveUserDetails);

module.exports = router;
