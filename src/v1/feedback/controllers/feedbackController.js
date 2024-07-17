const Feedback = require("../models/feedbackModel");
const User = require("../../auth/models/userModel");
const { logger } = require("../../../utils/logger");
const { OK, BAD_REQUEST, NOT_FOUND } = require("../../../utils/statuscode");

const addFeedback = async (req, res) => {
  try {
    const { feedback, rating } = req.body;
    const uid = req.userId;

    User.findById(uid).then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).json({
          error: "User not found",
        });
      }

      const newFeedback = new Feedback({
        user: user._id,
        feedback: feedback,
        rating: rating,
      });

      newFeedback.save().then((savedFeedback) => {
        res.status(OK).json({
          status: OK,
          message: "Feedback added successfully",
          data: savedFeedback,
        });
      });
    });
  } catch (error) {
    logger.error(error);
    res.status(BAD_REQUEST).json({
      error: "Failed to add feedback",
    });
  } finally {
    logger.info("Add Feedback API Called.");
  }
};

const getFeedbacks = async (req, res) => {
  try {
    let uid = req.userId;

    User.findById(uid).then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).json({
          error: "User not found",
        });
      }

      Feedback.findOne({ user: user._id })
        .sort({ createdAt: -1 })
        .then((feedbacks) => {
          res.status(OK).json({
            status: OK,
            message: "Feedbacks fetched successfully",
            data: feedbacks,
          });
        });
    });
  } catch (error) {
    logger.error(error);
    res.status(BAD_REQUEST).json({
      error: "Failed to fetch feedbacks",
    });
  } finally {
    logger.info("Get Feedbacks API Called");
  }
};

const updateFeedback = async (req, res) => {
  try {
    const { feedback, rating } = req.body;

    let uid = req.userId;

    const user = await User.findById(uid);

    if (!user) {
      return res.status(NOT_FOUND).json({
        error: "User not found",
      });
    }

    // Find the feedback entry for the user
    const existingFeedback = await Feedback.findOne({ user: user._id });

    if (!existingFeedback) {
      return res.status(NOT_FOUND).json({
        error: "Feedback not found",
      });
    }

    // Update the feedback and emoji fields
    existingFeedback.feedback = feedback;
    existingFeedback.rating = rating;

    // Save the updated feedback entry
    await existingFeedback.save();

    res.status(OK).json({
      status: OK,
      message: "Feedback updated successfully",
      data: existingFeedback,
    });
  } catch (error) {
    logger.error(error);
    res.status(BAD_REQUEST).json({
      error: "Failed to update feedback",
    });
  } finally {
    logger.info("Update Feedback API Called");
  }
};

const getAllFeedbacks = async (req, res) => {
  try {
    const feedback = await Feedback.find();
    if (!feedback) {
      res.status(NOT_FOUND).json({
        error: "Feedback not found",
      });
    }

    res.status(OK).json({
      status: OK,
      message: "Feedback found successfully",
      data: feedback,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { addFeedback, getFeedbacks, updateFeedback, getAllFeedbacks };
