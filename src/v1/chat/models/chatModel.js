const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    chatId: {
        type: String,
        required: true,
        unique: true,
    },
    recentMessage: {
        text:{
         type:String,
        },
        user:{
         type:mongoose.Schema.Types.ObjectId,
         ref:'User',
        }
    },
    recentMessageTime: {
        type: Date,
    },
    blocked: {
        isBlock: {
            type: Boolean,
            default: false
        },
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    }
})

const Chat = new mongoose.model("chat", chatSchema);
module.exports = Chat;