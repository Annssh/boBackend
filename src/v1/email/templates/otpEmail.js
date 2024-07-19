const React = require("react");
const { Html } = require("@react-email/components");

const Email = (props) => {
  const { otp, text } = props;

  return React.createElement(
    Html,
    { lang: "en" },
    text,
    React.createElement("strong", null, otp)
  );
};

module.exports = Email;
