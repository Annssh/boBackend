const React = require("react");
const sendgrid = require("@sendgrid/mail");
const { render } = require("@react-email/render");
const Email = require("./templates/otpEmail");

sendgrid.setApiKey(
  "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"
);

const sendOtpEmail = async (emailData) => {
  try {
    const emailHtml = render(
      React.createElement(Email, {
        text: emailData.text,
        otp: emailData.otp,
      })
    );

    const data = {
      from: "ritesh@flynaut-team.com",
      to: emailData.to,
      subject: emailData.subject,
      html: emailHtml,
    };

    await sendgrid.send(data);
  } catch (error) {
    console.error(error, "error");
  }
};

module.exports = sendOtpEmail;
