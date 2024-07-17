// Import the necessary modules
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    enum: ['info', 'cancel', 'payment'],
    default: 'info',
  },
  section: {
    type: String,
    enum: ['booking', 'payment', 'message', 'info'],
    default: 'info',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Notification model
const Notification = mongoose.model("notification", notificationSchema);

// Export the model
module.exports = Notification;
