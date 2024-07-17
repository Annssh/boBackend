const express = require("express");
const { INTERNAL_SERVER_ERROR, OK } = require("../../utils/statuscode");
const { upload } = require("../../helper/s3-Bucket");
const { createOrfindChat, getAllUsersChats, getAllMessages, sendMessage, getAllMessagesByChatId, getAllChatsByUserId } = require("./controllers/chatController");
const chatRouter = express.Router();


chatRouter.post("/upload-audio", upload.single("image"), async (req, res) => {
    try {

        let audioUrl = "";

        if (req.file) {
            audioUrl = req.file.location;
        }

        res.status(OK).json({
            Status: OK,
            message: "Audio Added successfully",
            data: audioUrl,
        });
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
});


chatRouter.post("/chat", createOrfindChat);

chatRouter.get("/chats/all",getAllUsersChats);

chatRouter.post("/send-message", sendMessage);

chatRouter.get("/messages/all", getAllMessages);

chatRouter.get("/messages/:chatId", getAllMessagesByChatId);

chatRouter.get("/chats/:userId",getAllChatsByUserId);



module.exports = chatRouter;