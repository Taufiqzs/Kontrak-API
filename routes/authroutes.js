const express = require("express");
const router = express.Router();
const authController = require("../controllers/authcontroller");

// alamat_route   POST /api/auth/registration
// deskripsi    Register a new user
// @access  Public
router.post("/registration", authController.register);

// alamat_route   POST /api/auth/login
// deskripsi    Login user
// @access  Public
router.post("/login", authController.login);

module.exports = router;
