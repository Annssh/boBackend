// const {
//   getFeedbacks,
//   updateFeedback,
//   addFeedback,
// } = require("../controllers/feedback");
// const {
//   getNotification,
//   deleteNotification,
//   turnOffNotification,
//   turnOnNotification,
// } = require("../controllers/addCar");

const { addNotifications, getNotifications, readAllNotifications } = require('./controllers/notificationController');
const notificationRoute = require('express').Router();

notificationRoute.get("/notifications", getNotifications);
notificationRoute.post("/notifications/read-all", readAllNotifications);

// notificationRoute.post(
//   "/notifications",
//   addNotifications
// );

// notificationRoute.post(
//   "/notifications",
//   addNotifications
// );

// notificationRoute.get(
//   "/turn-off/:userId/:notificationId",
//   isSameUserOrAdmin,
//   turnOffNotification
// );
// notificationRoute.get(
//   "/turn-on/:userId/:notificationId",
//   isSameUserOrAdmin,
//   turnOnNotification
// );
// // notificationRoute.get("/user-feedback/:userId", isSameUserOrAdmin, getFeedbacks);

// notificationRoute.delete(
//   "/delete-notification/:userId/:notificationId",
//   isSameUserOrAdmin,
//   deleteNotification
// );

module.exports = notificationRoute;
