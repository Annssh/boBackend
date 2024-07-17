const {
  OK,
  UNPROCESSABLE_ENTITY,
  BAD_REQUEST,
  NOT_FOUND,
  UNAUTHORIZED,
  INTERNAL_SERVER_ERROR,
} = require("../../../utils/statuscode");
const User = require("../models/userModel");
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


const resendOTP = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(BAD_REQUEST).json({
          error: "User not found.",
        });
      }
      const OTP = await Otp.findOne({email});
      if(!OTP){
        return res.status(BAD_REQUEST).json({
            error: "Bad Request",
          });
      }
      const otp = generateOTP();
      OTP.otp= otp;
      await OTP.save();
      const mailOption = mailOptionsResendOtp(email, otp);
  
      transporterInrequirestance.sendMail(mailOption, async function (error, info) {
        if (error) {
          return res.status(INTERNAL_SERVER_ERROR).json({
            error: "An error occurred while sending email.",
          });
        } else {
          console.log("Email sent: " + info.response);
  
  
          return res.status(OK).json({
            status: OK,
            message:
              "An email has been sent to your email address with instructions.",
          });
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(INTERNAL_SERVER_ERROR).json({
        error: "An error occurred while processing your request.",
      });
    }
  };


  module.exports = {
    resendOTP
  };