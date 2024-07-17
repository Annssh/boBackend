const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

const {
  updateMyProfile,
  getMyProfile,
  uploadProfilePicture,
  updateUserNotification
} = require("./controllers/profileController.js");

const profileRoutes = express.Router();



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads");
  },
  filename: (req, file, cb) => {
    const randomString = crypto.randomBytes(8).toString("hex");
    const fileExtension = path.extname(file.originalname);
    const uniqueFilename = randomString + fileExtension;

    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage });

// myprofileRoute.put(
//   "/my-profile/:userId",
//   isSameUserOrAdmin,
//   upload.single("profilePicture"),
//   addMyProfile
// );

profileRoutes.get("/user", getMyProfile);
profileRoutes.post("/user/upload", uploadProfilePicture);

// profileRoutes.get("/my-profile/:userId", getMyProfile);
profileRoutes.post("/user", upload.single("profile_picture"), updateMyProfile);

profileRoutes.put("/user/notification", updateUserNotification);

module.exports = profileRoutes;
