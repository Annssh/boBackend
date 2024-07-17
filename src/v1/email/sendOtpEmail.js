const React = require('react');
const sendgrid = require('@sendgrid/mail');
const otpEmailTemplate= require('./templates/otpEmail');
const { render } = require('@react-email/render');

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
console.log(process.env.SENDGRID_API_KEY);

const sendOtpEmail = async(email)=>{
    try {
        const emailHtml = render(React.createElement(otpEmailTemplate,  {url: "https://www.google.com"} ));
        const data= await sendgrid.send({
            from: 'ritesh@flynaut-team.com',
            to: [email],
            subject: 'Hello World',
            html: emailHtml,
          });
      console.log(data, "data");
      } catch (error) {
        console.error(error.response.body, "error");
      }
}

module.exports = sendOtpEmail;