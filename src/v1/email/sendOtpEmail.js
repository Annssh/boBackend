const React = require("react");
const sendgrid = require("@sendgrid/mail");
const otpEmailTemplate = require("./templates/otpEmail");
const { render } = require("@react-email/render");

sendgrid.setApiKey(
  "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"
);

const sendOtpEmail = async (emailData) => {
  try {
    // const emailHtml = render(React.createElement(otpEmailTemplate));
    const data = {
      from: "ritesh@flynaut-team.com",
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    };
    await sendgrid.send(data);
  } catch (error) {
    console.error(error, "error");
  }
};

module.exports = sendOtpEmail;
