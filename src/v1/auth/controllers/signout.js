const {
  OK,
  UNPROCESSABLE_ENTITY,
  BAD_REQUEST,
  NOT_FOUND,
  UNAUTHORIZED,
  INTERNAL_SERVER_ERROR,
} = require("../../../utils/statuscode");


const signout = (req, res) => {
    res.clearCookie("Token");
    res.status(OK).json({
      status: OK,
      message: "User Signed Out Sucessfully!",
    });
  };


  module.exports = {
    signout,
  };