const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    sentBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        // required: true,
        // type: String,
        required: true,
    },
    time:{
        type: Date,
        default: Date.now,
    },
    message: {
        type: String,
        required: true,
    },
    type:{
        type: String,
        required: true,
    },
    chatId:{
        type: String,
        required: true, 
    }
})


const Message = mongoose.model("Message", messageSchema);
module.exports = Message;