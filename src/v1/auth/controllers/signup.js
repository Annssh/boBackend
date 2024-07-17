const jwt = require("jsonwebtoken");
const {
  OK,
  UNPROCESSABLE_ENTITY,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} = require("../../../utils/statuscode");
const { validationResult } = require("express-validator");
const { hashPassword } = require("../../../helper/auth");

const { logger } = require("../../../utils/logger");
const SignUpOTP = require("../models/otpModel");
const User = require("../models/userModel");

const signUp = async (req, res) => {
  const errors = validationResult(req) || [];
  if (!errors.isEmpty()) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      errors: errors.array(),
    });
  }

  try {
    const { otp, email, password, role } = req.body;
    if (!email || !password) {
      return res
        .status(BAD_REQUEST)
        .json({ error: "Missing required fields" });
    }
    const validRoles = ["User", "Admin"];
    // const selectedRole = role && validRoles.includes(role) ? role : "User";

    // const existingUser = await User.findOne({ email });

    // if (existingUser) {
    //   return res.status(BAD_REQUEST).json({
    //     error: "Email address already registered.",
    //   });
    // }
    const hashedPassword = hashPassword(password, process.env.SALT || "");

    // check if otp is valid 
    // set temp tp false for this user 
    const existingOtp = await SignUpOTP.findOne(
      { reference: email }
    );
    console.log(existingOtp);
    console.log(otp);


    if (!existingOtp) {
      return res.status(BAD_REQUEST).json({
        error: "OTP not found for the provided email.",
      });
    }
    if (existingOtp.otp != otp) {
      return res.status(BAD_REQUEST).json({
        error: "Invalid OTP",
      });
    }
    // if exists , find a user with username 
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(BAD_REQUEST).json({
        error: "User not found",
      });
    }
    // set temp to false for that user , and also set a hashed password for that user
    existingUser.temp = false;
    try {
      const hashedPassword = await hashPassword(password);
      existingUser.password = hashedPassword;
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR).json({
        error: error.message,
      });
    }
    const data = await existingUser.save();

    await SignUpOTP.deleteOne({ _id: existingOtp._id });


    const expiryTime = new Date();

    expiryTime.setMonth(expiryTime.getMonth() + 2);

    const exp = expiryTime.getTime() / 1000;

    const token = jwt.sign(
      { _id: data.id, exp: exp },
      process.env.SECRET || ""
    );

    res.status(OK).json({
      status: OK,
      message: "New user registered successfully.",
      token,
      data: data,
    });

  } catch (error) {
    console.error(error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  }
};


module.exports = {
  signUp,
};