const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    media:{
        type:String,
        required:true,
    },
    content:{
     type:String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default:[],
            sparse:true
        }],
    comments:[{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            default:[],
            sparse:true
        },
        text:String,
        time:Date,
    }],
    time:{
        type:Date,
        default:Date.now
    }
})

const Post = new mongoose.model("Post", chatSchema);
module.exports = Post;