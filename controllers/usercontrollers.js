const User = require("models");
const multir = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multir for file upload
const storage = multir.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/profile-images/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, req.user._id + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

exports.upload = multir({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

//Get user profile Private
//   GET /api/user/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -__v");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get profile" });
  }
};

//     Update user profile Private
//  PUT /api/user/profile/update

exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = ["firstname", "lastname"];

    // Filter allowed fields
    const filteredUpdates = {};
    Object.keys(updates).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    // Update user
    const user = await User.findByIdAndUpdate(req.user._id, { $set: filteredUpdates }, { new: true, runValidators: true }).select("-password -__v");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

// @desc    Upload profile image
// @route   POST /api/user/profile/image
// @access  Private
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload an image" });
    }

    // Delete old image if exists
    const user = await User.findById(req.user._id);
    if (user.profileImage) {
      const oldImagePath = user.profileImage.replace("/uploads", "uploads");
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update user with new image path
    const imagePath = "/uploads/profile-images/" + req.file.filename;
    user.profileImage = imagePath;
    await user.save();

    res.json({
      success: true,
      message: "Profile image uploaded successfully",
      imageUrl: imagePath,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};
