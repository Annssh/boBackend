const { NOT_FOUND } = require("../utils/statuscode");
const User = require("../v1/auth/models/userModel");
const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(req.headers);
  console.log("checking auth");
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    console.log(authHeader);
    console.log(token);
    if (!token) {
      return res.status(401).json({
        error: "No Token",
      });
    }
    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      console.log(decoded);
      // get a user with this valid user id
      let user = await User.findById(decoded._id);
      if (!user) {
        return res.status(401).json({
          error: "Invalid Token",
        });
      } else {
        req.user = user;
        req.userId = decoded._id;
        console.log(user);
        next();
      }
    } catch (err) {
      console.error(err);
      return res.status(401).json({
        error: "Invalid Token",
      });
    }
  } else {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }
};

const isSameUserOrAdmin = [
  isAuthenticated,
  async (req, res, next) => {
    if (req.user.role === 3) {
      next();
    }
    next();
  },
];

const isAdmin = async (req, res, next) => {
  if (req.user.role === 3) {
    next();
  } else {
    res.status(401).json({
      error: "Unauthorized",
    });
  }
};

module.exports = {
  isAuthenticated,
  isAdmin,
  isSameUserOrAdmin,
};
