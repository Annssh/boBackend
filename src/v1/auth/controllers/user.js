const {
  OK,
  UNPROCESSABLE_ENTITY,
  BAD_REQUEST,
  NOT_FOUND,
  UNAUTHORIZED,
  INTERNAL_SERVER_ERROR,
} = require("../../../utils/statuscode");
const User = require("../models/userModel");

const getAllUsers = async (req, res) => {
    try {
      const users = await User.find().sort({ createdAt: -1 });
  
      return res.status(OK).json({
        status: OK,
        message: "All Users fetched successfully.",
        total_Users: users.length,
        data: users,
      });
    } catch (error) {
      console.error(error);
      return res.status(INTERNAL_SERVER_ERROR).json({
        error: "An error occurred while all users request.",
      });
    }
  };
  
  const deleteUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const response = await User.findOneAndDelete({ userId });
      return res
        .status(200)
        .json({ status: OK, message: "User Deleted successfully.", response });
    } catch (error) {
      console.log("error: ", error);
      return res.status(500).json({ error: "Error in deleting user." });
    }
  };
  
  const updateUserSettings = async (req, res) => {
    try {
      const { userId } = req.params;
      console.log(req.body);
      const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
  
      console.log(user);
      return res
        .status(OK)
        .json({ status: OK, message: "User Settings Updated Successfully.", user });
    } catch (error) {
      return res.status(500).json({ error: "Error in Updating User settings." });
    }
  }


  module.exports = {
    getAllUsers,
    deleteUser,
    updateUserSettings
  };