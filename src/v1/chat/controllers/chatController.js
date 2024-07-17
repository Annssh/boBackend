const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const { v4: uuidv4 } = require("uuid");
const { OK, INTERNAL_SERVER_ERROR } = require("../../../utils/statuscode");
const { default: mongoose } = require("mongoose");


const createOrfindChat = async (req, res) => {
    try {
        console.log("abcd")
        const { user1, user2 } = req.body;
        console.log(req.body);
        const chat = await Chat.findOne({$or: [{users:[user1,user2]}, {users:[user2,user1]}]});
        console.log(chat);
        if (chat) {
            const allMessageData = await Message.find({ chatId: chat.chatId });
            return res.status(OK).json({
                success: OK,
                message: "Chat Already Exists",
                data: allMessageData,
                chatId: chat.chatId,
            })
        }
        else {
            const chatId = uuidv4();
            const chat = new Chat({ users:[user1, user2], chatId });
            await chat.save();
            return res.status(OK).json({
                success: OK,
                message: "Chat Created Successfully",
                data: [],
                chatId,
            })
        }
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
}

const getAllUsersChats = async (req, res) => {
    try {
        const chatIds = await Chat.find({});

        const getMessagesPromise = chatIds.map(async (chat) => {
            const chatId = chat.chatId;
            const messages = await Message.find({ chatId });
            return { chat, messages };
        });

        const [data] = await Promise.all([getMessagesPromise]);

        return res.status(OK).json({
            success: OK,
            message: "Chats Found Successfully",
            data,
        })
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
}

const getAllMessages = async (req, res) => {
    try {
        const allMessages = await Message.find({});
        return res.status(OK).json({
            success: OK,
            message: "Messages Found Successfully",
            data: allMessages,
        })
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
}

const getAllMessagesByChatId = async (req, res) => {
    try {
        const { chatId } = req.params;
        const allMessages = await Message.find({ chatId });
        return res.status(OK).json({
            success: OK,
            message: "Messages Found Successfully",
            data: allMessages,
        })
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
}

const getAllChatsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        // const userId =new mongoose.Types.ObjectId(req.params.userId);

        const chatData = await Chat.find({
           users:{$in: [userId]} 
        })
        .populate("users")
        .populate("recentMessage.user");

        console.log(chatData);

        const chatDetailsPromise = chatData.map(async (c) => {
            const obj = {users:c.users, recentMessage: c.recentMessage, recentMessageTime: c.recentMessageTime};
            // const message = await Message.findOne({ chatId: c.chatId }).sort({ time: -1 }).populate("sentBy");;

            return obj
        });

        const chatDetails = await Promise.all(chatDetailsPromise);

        return res.status(OK).json({
            success: OK,
            message: "Chats Found Successfully",
            data: chatDetails,
        })
    } catch (error) {
        console.log(error);
        return res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
}

const sendMessage = async (req, res) => {
    try {
        const message = new Message(req.body);
        await message.save();
        const chat= await Chat.findOne({chatId:message.chatId});
        chat.recentMessage={
            text:message.message,
            user:message.sentBy,
        };
        chat.recentMessageTime= new Date(Date.now());
        await chat.save();

        return res.status(OK).json({
            success: OK,
            message: "Messages sent Successfully",
            msg: message
        })
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
}

module.exports = { createOrfindChat, getAllUsersChats, getAllMessages, getAllMessagesByChatId, sendMessage, getAllChatsByUserId };