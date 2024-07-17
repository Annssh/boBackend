const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
 title:{
    type:String,
    required:[true, "Please enter ticket title"]
 },
 ticketId:{
    type:Number,
    unique:true,
    required:[true, "Please enter ticket id"],
 },
 status:{
    type:String,
    enum:["open", "solved"],
    default:"open",
 },
 description:{
    type:String,
    required:[true, "Please enter ticket description"]
 },
 user:{
   type: mongoose.Schema.Types.ObjectId,
   ref:"user"
 }
},
{
    timestamps:true,
}
);

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports= Ticket;