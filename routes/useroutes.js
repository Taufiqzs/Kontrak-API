const router = express.Router();
const userControllers = require("../controllers/usercontrollers");
const auth = require("../middleware/auth");

// All routes are protected
router.use(auth);

// alamat_route   GET /api/user/profile
// deskripsi    Get user profile
// akses  Private
router.get("/profile", userControllers.getProfile);

// alamat_route   PUT /api/user/profile/update
// deskripsi    Update user profile
// akses  Private
router.put("/profile/update", userControllers.updateProfile);

// alamat_route   POST /api/user/profile/image
// deskripsi    Upload profile image
// akses  Private
router.post("/profile/image", userControllers.upload.single("profileImage"), userControllers.uploadProfileImage);

module.exports = router;
