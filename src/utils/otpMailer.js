const express = require("express");
const User = require("../v1/auth/models/userModel");
const nodemailer = require("nodemailer");

const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: "mail.flynaut.net",
    port: 465,
    secure: true,
    auth: {
      user: "mushahid@flynaut.net", // Your webmail email address
      pass: "Mushahid@786", // Your webmail password
    },
  });
  return transporter;
};

const generateOTP = () => {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

const mailOptionsSignup = (email, otp) => {
  return {
    from: "mushahid@flynaut.net",
    to: email,
    subject: "Signup Verification OTP",
    html: `
            <div style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.5; text-align: center;">
              <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">Signup Verification OTP</h2>
              <p style="margin-bottom: 20px;">Your OTP for signup verification is:</p>
              <div style="border: 3px solid #6c757d; padding: 20px; border-radius: 10px; display: inline-block;">
                <p style="font-size: 28px; font-weight: bold; margin-bottom: 20px;">${otp}</p>
              </div>
              <p style="margin-top: 20px;">Please enter this OTP to complete the signup process.</p>
              <div style="padding: 10px; border-radius: 5px;">
                <p style="font-size: 12px; margin-bottom: 5px;">Note: This is a system-generated email. Please do not reply.</p>
                <p style="font-size: 12px; margin-bottom: 5px;">If you did not request this email, please ignore and delete it.</p>
              </div>
            </div>
          `,
  };
};

const mailOptionsLogin = (email, otp) => {
  return {
    from: "mushahid@flynaut.net",
    to: email,
    subject: "Login Verification OTP",
    html: `
              <div style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.5; text-align: center;">
                <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">Login Verification OTP</h2>
                <p style="margin-bottom: 20px;">Your OTP for login verification is:</p>
                <div style="border: 3px solid #6c757d; padding: 20px; border-radius: 10px; display: inline-block;">
                  <p style="font-size: 28px; font-weight: bold; margin-bottom: 20px;">${otp}</p>
                </div>
                <p style="margin-top: 20px;">Please enter this OTP to complete the login process.</p>
                <div style="padding: 10px; border-radius: 5px;">
                  <p style="font-size: 12px; margin-bottom: 5px;">Note: This is a system-generated email. Please do not reply.</p>
                  <p style="font-size: 12px; margin-bottom: 5px;">If you did not request this email, please ignore and delete it.</p>
                </div>
              </div>
            `,
  };
};
const mailOptionsForgotPassword = (email, otp) => {
  return {
    from: "mushahid@flynaut.net",
    to: email,
    subject: "Password Reset OTP",
    html: `
            <div style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.5; text-align: center;">
              <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">Password Reset OTP</h2>
              <p style="margin-bottom: 20px;">Your OTP for password reset is:</p>
              <div style="border: 3px solid #6c757d; padding: 20px; border-radius: 10px; display: inline-block;">
                <p style="font-size: 28px; font-weight: bold; margin-bottom: 20px;">${otp}</p>
              </div>
              <p style="margin-top: 20px;">Please enter this OTP to reset your password.</p>
              <div style="padding: 10px; border-radius: 5px;">
                <p style="font-size: 12px; margin-bottom: 5px;">Note: This is a system-generated email. Please do not reply.</p>
                <p style="font-size: 12px; margin-bottom: 5px;">If you did not request this email, please ignore and delete it.</p>
              </div>
            </div>
          `,
  };
};
const mailOptionsResendOtp = (email, otp) => {
  return {
    from: "mushahid@flynaut.net",
    to: email,
    subject: "OTP",
    html: `
              <div style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.5; text-align: center;">
                <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">Password Reset OTP</h2>
                <p style="margin-bottom: 20px;">Your new OTP is:</p>
                <div style="border: 3px solid #6c757d; padding: 20px; border-radius: 10px; display: inline-block;">
                  <p style="font-size: 28px; font-weight: bold; margin-bottom: 20px;">${otp}</p>
                </div>
                <p style="margin-top: 20px;">Please enter this OTP.</p>
                <div style="padding: 10px; border-radius: 5px;">
                  <p style="font-size: 12px; margin-bottom: 5px;">Note: This is a system-generated email. Please do not reply.</p>
                  <p style="font-size: 12px; margin-bottom: 5px;">If you did not request this email, please ignore and delete it.</p>
                </div>
              </div>
            `,
  };
};
const mailOptionsBulkUsers = (name, email, password) => {
  return {
    from: "mushahid@flynaut.net",
    to: email,
    subject: "Welcome to Our Platform",
    html: `
      <div style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.5; text-align: center;">
        <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">Welcome to Our Platform</h2>
        <p style="margin-bottom: 20px;">Hello ${name},</p>
        <p style="margin-bottom: 20px;">Your account has been successfully created:</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p style="margin-top: 20px;">Please keep your login credentials safe.</p>
        <div style="padding: 10px; border-radius: 5px;">
          <p style="font-size: 12px; margin-bottom: 5px;">Note: This is a system-generated email. Please do not reply.</p>
          <p style="font-size: 12px; margin-bottom: 5px;">If you have any questions or need assistance, please contact our support team.</p>
        </div>
      </div>
    `,
  };
};

const mailOptionsSchool = (name, email, password) => {
  return {
    from: "mushahid@flynaut.net",
    to: email,
    subject: "Welcome to Our Platform",
    html: `
      <div style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.5; text-align: center;">
        <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">Welcome to Our Platform</h2>
        <p style="margin-bottom: 20px;">Hello ${name},</p>
        <p style="margin-bottom: 20px;">Your account has been successfully created:</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p style="margin-top: 20px;">Please keep your login credentials safe.</p>
        <div style="padding: 10px; border-radius: 5px;">
          <p style="font-size: 12px; margin-bottom: 5px;">Note: This is a system-generated email. Please do not reply.</p>
          <p style="font-size: 12px; margin-bottom: 5px;">If you have any questions or need assistance, please contact our support team.</p>
        </div>
      </div>
    `,
  };
};

module.exports = {
  createTransporter,
  mailOptionsSignup,
  generateOTP,
  mailOptionsForgotPassword,
  mailOptionsLogin,
  mailOptionsResendOtp,
  mailOptionsSchool,
  mailOptionsBulkUsers,
};
