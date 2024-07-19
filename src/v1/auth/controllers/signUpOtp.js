const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  WRONG_ENTITY,
  OK,
} = require("../../../utils/statuscode");
const User = require("../models/userModel");
const sendEmail = require("../../../utils/otpMailer");
const SignUpOTP = require("../models/otpModel");
const sendOtpEmail = require("../../email/sendOtpEmail");

const signupOtp = async (req, res) => {
  const { email, password } = req.body;

  // Validate username
  if (!email) {
    return res.status(WRONG_ENTITY).json({
      error: "Email is required.",
    });
  }

  try {
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      let message = "";
      message = "User already exists.";
      return res.status(BAD_REQUEST).json({
        error: message,
      });
    }
    // if no user , add to user model with temp set to true
    await User.create({
      email: email || null,
      // phone_number: phone_number || null,
      temp: true,
    });

    // generate an OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // add this to Otp
    const newOtp = new SignUpOTP({
      reference: email,
      otp,
    });
    await newOtp.save();

    // Send OTP
    if (email) {
      const emailData = {
        to: email,
        subject: "Signup Verification OTP",
        otp: otp,
        text: `Your OTP for signup verification is `,
        html: `<p>Your OTP for signup verification is <strong>${otp}</strong>.</p>`,
      };

      //send otp to email with subject and html
      await sendOtpEmail(emailData);
    }

    return res.status(OK).json({
      status: OK,
      message: "OTP Sent!",
      data: newOtp,
    });
  } catch (error) {
    console.error(error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  }
};

module.exports = signupOtp;
