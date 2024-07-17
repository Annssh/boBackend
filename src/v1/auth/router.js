const express = require("express");
const multer = require("multer");
const { check, body } = require("express-validator");
const { signUp, validateOTP } = require("./controllers/signup");
const { forgotPassword, forgotPasswordOtpValidation, resetPassword, } = require("./controllers/forgotPassword");
const { login } = require("./controllers/login");
const { resendOTP } = require("./controllers/resendOtp");
const { signout } = require("./controllers/signout");
const { getAllUsers, deleteUser, updateUserSettings } = require("./controllers/user");



const User = require("./models/userModel");
const { memoryStorage } = require("multer");
const path = require("path");
const signupOtp = require("./controllers/signUpOtp");

const authenticationRoute = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads");
  },
  filename: (req, file, cb) => {
    // console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

authenticationRoute.post(
  "/signup-otp",
  [
    check("email")
      .isEmail()
      .withMessage("Please provide a valid email address.")
      .custom((value) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("Email address already registered.");
          }
        });
      }),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password length should be minimum of 8 characters."),
  ],
  signupOtp
);

authenticationRoute.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please provide a valid email address.")
    ,
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password length should be minimum of 8 characters."),
  ],
  signUp
);

authenticationRoute.post(
  "/login",
  [
    check("email")
      .isLength({ min: 3 })
      .withMessage("Please provide a valid email address."),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password length should be minimum of 8 characters."),
    body().custom((value, { req }) => {
      if (!req.body.email) {
        throw new Error("Please enter your email.");
      }
      if (!req.body.password) {
        throw new Error("Please enter your password.");
      }
      return true;
    }),
  ],
  login
);

authenticationRoute.post(
  "/forgot-password",
  [
    check("email")
      .isEmail()
      .withMessage("Please provide a valid email address.")
      .custom((value) => {
        return User.findOne({ email: value }).then((user) => {
          if (!user) {
            return Promise.reject("Email address not found.");
          }
        });
      }),
  ],
  forgotPassword
);

authenticationRoute.post(
  "/forgot-password-otp",
  [
    check("email")
      .isEmail()
      .withMessage("Please provide a valid email address.")
      .custom((value) => {
        return User.findOne({ email: value }).then((user) => {
          if (!user) {
            return Promise.reject("Email address not found.");
          }
        });
      }),
  ],
  forgotPasswordOtpValidation
);

authenticationRoute.post(
  "/reset-password",
  [
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password length should be minimum of 8 characters."),
    // check("confirmPassword").custom((value, { req }) => {
    //   if (value !== req.body.confirmPassword) {
    //     throw new Error("Passwords do not match.");
    //   }
    //   return true;
    // }),
  ],
  resetPassword
);

authenticationRoute.post(
  "/resend-otp",
  [
    check("email")
      .isEmail()
      .withMessage("Please provide a valid email address.")
      .custom((value) => {
        return User.findOne({ email: value }).then((user) => {
          if (!user) {
            return Promise.reject("Email address not found.");
          }
        });
      }),
  ],
  resendOTP
);
// authenticationRoute.post(
//   "/verify-otp",
//   [
//     check("otp")
//       .isNumeric()
//       .withMessage("OTP should be numeric.")
//       .isLength({ min: 6, max: 6 })
//       .withMessage("OTP should be 6 digits."),
//   ],
//   validateOTP
// );

// authenticationRoute.post(
//   "/send-otp",
//   [
//     check("otp")
//       .isNumeric()
//       .withMessage("OTP should be numeric.")
//       .isLength({ min: 6, max: 6 })
//       .withMessage("OTP should be 6 digits."),
//   ],
//   validateOTP
// );
authenticationRoute.get("/all-users/", getAllUsers);
authenticationRoute.delete("/delete-user/:userId/", deleteUser);

authenticationRoute.get("/signout", signout);

authenticationRoute.put("/update-user/:userId", updateUserSettings)

module.exports = authenticationRoute;