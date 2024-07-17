const express = require("express");
const { isSameUserOrAdmin } = require("../../middleware/index");
const { getAllFeedbacks, updateFeedback, addFeedback, } = require("./controllers/feedbackController");
const feedbackRoute = express.Router();

feedbackRoute.post("/feedbacks", isSameUserOrAdmin, addFeedback);
feedbackRoute.get("/feedbacks", isSameUserOrAdmin, getAllFeedbacks);

feedbackRoute.put("/feedbacks/:userId", isSameUserOrAdmin, updateFeedback);

module.exports = feedbackRoute;
