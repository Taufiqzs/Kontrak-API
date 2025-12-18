const express = require("express");
const router = express.Router();
const infoController = require("../controllers/infocontrollers");

// alamat_route   GET /api/info/banner
// deskripsi    Get banners
// @access  Public
router.get("/banner", infoController.getBanners);

// alamat_route   GET /api/info/services
// deskripsi    Get services
// @access  Public
router.get("/services", infoController.getServices);

module.exports = router;
