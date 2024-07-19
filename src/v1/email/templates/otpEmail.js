const React = require('react');
const { Html, Button } = require('@react-email/components');

function Email(props) {
  const { url } = props;

  return React.createElement(
    Html,
    { lang: "en" },
    React.createElement(Button, { href: url }, "Click me")
  );
}

module.exports = Email;
