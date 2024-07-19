const jwt = require("jsonwebtoken");
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
const { authenticate } = require("../../../helper/auth");
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

const login = async (req, res) => {
  const errors = validationResult(req) || [];

  if (!errors.isEmpty()) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      status: UNPROCESSABLE_ENTITY,
      error: errors.array()[0]?.msg,
    });
  }
  const { email, password } = req.body;
  try {
    User.findOne({ email }).then(async (user) => {
      if (!user) {
        return res.status(NOT_FOUND).json({
          status: NOT_FOUND,
          error: "User Not Found.",
        });
      }
      const userData = user;
      let OTP = await Otp.findOne({ email });

      if (OTP && OTP.password) {
        const otp = generateOTP();
        const mailOption = mailOptionsSignup(email, otp);
        transporterInrequirestance.sendMail(
          mailOption,
          async function (error, info) {
            if (error) {
              console.log(error);
              return res.status(INTERNAL_SERVER_ERROR).json({
                error: "An error occurred while sending email.",
              });
            } else {
              OTP.otp = otp;
              await OTP.save();
              return res.status(OK).json({
                message: "OTP has been sent on your mail. Please verify.",
              });
            }
          }
        );
      } else {
        if (
          // !authenticate(password, process.env.SALT || "", userData.password)
          !authenticate(password, userData.password)
        ) {
          return res.status(UNAUTHORIZED).json({
            status: UNAUTHORIZED,
            error: "Oops!, E-mail or Password is incorrect!",
          });
        }
        if (user.roles !== "User" && user.roles !== "Admin") {
          return res.status(UNAUTHORIZED).json({
            status: UNAUTHORIZED,
            error: "You do not have permission to login.",
          });
        }

        const expiryTime = new Date();

        expiryTime.setMonth(expiryTime.getMonth() + 2);

        const exp = expiryTime.getTime() / 1000;

        const token = jwt.sign(
          { _id: userData.id, exp: exp },
          process.env.SECRET || ""
        );

        return res.status(OK).json({
          status: OK,
          message: " Logged in Successfully!",
          token,
          userData,
        });
      }
    });
  } catch (err) {
    logger.error(err);
  } finally {
    logger.info(`Login API called - UserName: -${req.body.email}`);
  }
};

module.exports = {
  login,
};
