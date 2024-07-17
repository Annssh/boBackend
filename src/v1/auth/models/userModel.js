const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// SAME MODEL IS ALSO USED FOR USER AND ADMIN 

const userSchema = new Schema(
  {
    first_name: {
      type: String,
      default: "",
    },
    last_name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      unique: [true, "Email address already registered."],
      trim: true,
      validate: {
        validator: function (email) {
          return /\S+@\S+\.\S+/.test(email);
        },
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      trim: true,
    },
    phone_number: {
      type: String,
      trim: true
    },
    profile_picture: {
      type: String,
      default: "",
    },
    dob: {
      type: Date,
    },
    otp: {
      type: String,
      default: "",
    },
    fcm_token: {
      type: String,
      default: "",
    },
    roles: {
      type: String,
      enum: {
        values: ["Admin", "User"],
        message: "Invalid role",
      },
      default: "User",
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    auth_providers: {
      type: [String],
      default: ['email']
    },
    is_subscribed: {
      type: Boolean,
      default: true,
    },
    subscription_plan: {
      type: String,
      default: 'TRIAL',
      values: ['TRAIL', 'EXPIRED', "BASIC", "NONE"],
    },
    subscription_start_date: {
      type: Date,
      default: Date.now,
      required: [true, 'Start date is required']
    },
    subscription_end_date: {
      type: Date,
      default: Date.now,
      required: [true, 'End date is required']
    },
    meals_notifications: {
      type: Boolean,
      default: true,
    },
    remainder_notifications: {
      type: Boolean,
      default: true,
    },
    temp: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
