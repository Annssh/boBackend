const {
  OK,
  INTERNAL_SERVER_ERROR,
} = require("../../../utils/statuscode");

const { addNotification, getNotification, readAllNotification } = require('../../../utils/notifications')

const addNotifications = async (req, res) => {

  try {
    const userId = req.params.userId;
    const { userid, message, type, section } = req.body;
    console.log(userid, message, type, section);

    const newNotification = await addNotification(userid, message, type, section);
    res.status(OK).json({
      Status: OK,
      message: "Notification added successfully",
      data: newNotification,
    });
  }
  catch (error) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}

const getNotifications = async (req, res) => {
  try {
    await getNotification(req, res);
  }
  catch (error) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}

const readAllNotifications = async (req, res) => {
  try {
    await readAllNotification(req, res);
  }
  catch (error) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}

module.exports = {
  addNotifications,
  getNotifications,
  readAllNotifications
};