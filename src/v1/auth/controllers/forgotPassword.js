const uuid = require('uuid');
const {
  OK,
  UNPROCESSABLE_ENTITY,
  BAD_REQUEST,
  NOT_FOUND,
  UNAUTHORIZED,
  INTERNAL_SERVER_ERROR,
} = require("../../../utils/statuscode");
const User = require("../models/userModel");
const { validationResult } = require("express-validator");
const { hashPassword, authenticate } = require("../../../helper/auth");
const {
  generateOTP,
  mailOptionsSignup,
  mailOptionsLogin,
  createTransporter,
  mailOptionsForgotPassword,
  mailOptionsResendOtp,
  mailOptionsBulkUsers,
} = require("../../../utils/otpMailer");
const transporterInrequirestance = createTransporter();
const { logger } = require("../../../utils/logger");
const Otp = require("../models/otpModel");


const forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(NOT_FOUND).json({
          status: NOT_FOUND,
          error: "User Not Found.",
        });
      }
  
      const otp = generateOTP();
      const mailOption = mailOptionsForgotPassword(email, otp);
  
      transporterInrequirestance.sendMail(mailOption, async function (error, info) {
        if (error) {
          return res.status(INTERNAL_SERVER_ERROR).json({
            error: "An error occurred while sending email.",
          });
        } else {
          console.log("Email sent: " + info.response);
  
          let OTP = await Otp.findOne({email});
          if(OTP){
            OTP.otp= otp;
          }
          else{
            OTP = new Otp({
              email,
              otp
            });
          }
          await OTP.save();
  
          return res.status(OK).json({
            status: OK,
            message:
              "An email has been sent to your email address with instructions on how to reset your password.",
            role: user.role,
          });
        }
      });
    } catch (error) {
      console.log(error);
      return res.status(INTERNAL_SERVER_ERROR).json({
        error: "An error occurred while processing your request.",
      });
    }
  };
  
  const forgotPasswordOtpValidation=async(req,res)=>{
    try {
      const {email,otp} = req.body;
      const OTP = await Otp.findOne({email});
      if(!OTP || OTP.otp!==otp){
        return res.status(BAD_REQUEST).json({
          status: BAD_REQUEST,
          error: "Invalid OTP",
        }); 
      }
      const ID= uuid.v4();
      OTP.ID= ID;
      await OTP.save();
      res.status(OK).json({
        status:OK,
        message:"OTP validated successfully",
        ID
      })
    } catch (error) {
      return res.status(BAD_REQUEST).json({
        status: BAD_REQUEST,
        error: "Something went wrong.",
      });
    }
  }
  
  const resetPassword = async (req, res) => {
    try {
      const errors = validationResult(req) || [];
  
      if (!errors.isEmpty()) {
        return res.status(UNPROCESSABLE_ENTITY).json({
          status: UNPROCESSABLE_ENTITY,
          error: errors.array()[0]?.msg,
        });
      }
  
      const { email, password, ID } = req.body;
  
      const user = await User.findOne({ email });
  
      if (!password) {
        return res.status(BAD_REQUEST).json({
          status: BAD_REQUEST,
          error: "No password",
        });
      }
  
      if (!user) {
        return res.status(NOT_FOUND).json({
          status: NOT_FOUND,
          error: "User not found.",
        });
      }
  
      if (!ID) {
        return res.status(NOT_FOUND).json({
          status: NOT_FOUND,
          error: "ID not found.",
        });
      }
  
      const OTP = await Otp.findOne({email});
      if(OTP.ID !==ID){
        return res.status(UNAUTHORIZED).json({
          status: UNAUTHORIZED,
          error: "Invalid Id",
        });
      }
  
      await Otp.findByIdAndDelete(OTP._id);
  
      const hashedPassword = hashPassword(password, process.env.SALT || "");
  
      user.password = hashedPassword;
  
      const updatedUser = await user.save();
  
      return res.status(OK).json({
        status: OK,
        message: "Password updated successfully.",
        data: updatedUser,
      });
    } catch (err) {
      return res.status(BAD_REQUEST).json({
        status: BAD_REQUEST,
        error: "Something went wrong.",
      });
    }
  };


  module.exports = {
    forgotPassword,
    forgotPasswordOtpValidation,
    resetPassword,
  };