const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const signUpOtpSchema = new Schema(
    {
        reference: {
            type: String,
        },
        otp: {
            type: String,
            default: "",
        },
        created_at: {
            type: Date,
            default: Date.now,
            expires: 300,
        },
    },
    {
        timestamps: true,
    }
);

const SignUpOTP = mongoose.model("signup_otp", signUpOtpSchema);
module.exports = SignUpOTP;