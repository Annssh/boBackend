const {
  OK,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../../../../utils/statuscode");
const User = require("../../../auth/models/userModel");
const { upload } = require("../../../../helper/s3-Bucket");
const { addNotification } = require('../../../../utils/notifications');
const { log } = require("winston");
const { logger } = require("../../../../utils/logger");

const getMyProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(NOT_FOUND).json({ error: "User profile not found" });
    }
    return res.status(OK).json({
      Status: OK,
      message: "User Profile retrieved successfully",
      data: user,
    });
  } catch (err) {
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(NOT_FOUND).json({ error: "User profile not found" });
    }
    let profile_picture = "";

    if (req.file) {
      profile_picture = req.file.filename;
    }

    const updatedProfile = { ...req.body };
    console.log(updatedProfile);

    if (profile_picture) {
      updatedProfile.profile_picture = profile_picture;
    }
    const updatedUserProfile = await User.findByIdAndUpdate(
      { _id: userId },
      updatedProfile,
      { new: true }
    );
    console.log(updatedUserProfile);

    res.status(OK).json({
      Status: OK,
      message: "User Profile updated successfully",
      data: updatedUserProfile,
    });
  } catch (err) {
    console.log('ab');
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

const updateUserNotification = async (req, res) => {
  try {
    const userId = req.userId;
    const updates = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(NOT_FOUND).json({ error: "User profile not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });

    await addNotification(user._id, "User notification updated sucessfully", 'info', 'info');

    res.status(OK).json({
      Status: OK,
      message: "User notification updated sucessfully",
      data: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

const uploadProfilePicture = [
  upload.single("image"),
  async (req, res) => {
    try {
      // check if req files exists 
      if (!req.file) {
        return res.status(400).json({ error: "Please upload a file" });
      }
      const file = req.file;

      await User.findOneAndUpdate(
        { _id: req.userId },
        { profilePicture: file.location },
        { new: true }
      );
      // console.log(file);
      // console.log(file.location);
      // console.log(file.mimetype.split("/")[0]);
      // upload(uuidv4(), file.buffer, file.mimetype);
      res.status(OK).json({
        Status: OK,
        message: "File uploaded successfully",
        data: file.location,
      });
    } catch (e) {
      console.error(e);
      res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
  },
]

module.exports = { getMyProfile, updateMyProfile, updateUserNotification, uploadProfilePicture };
