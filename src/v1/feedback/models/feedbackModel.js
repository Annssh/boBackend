const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedbackSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please add userId."],
    },
    feedback: {
      type: String,
      required: [true, "Please provide your feedback message."],
    },
    rating: {
      type: Number,
      enum: [0, 1, 2, 3, 4],
      required: true
    },
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
