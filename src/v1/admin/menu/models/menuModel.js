const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
 title:{
    type:String,
    required:[true, "Please enter dish title"]
 },
 ingridents:{
    type:[String],
    required:[true, "Please enter dish ingridents"]
 },
 image:{
    type:String,
    required:[true, "Please enter dish image"]
 },
 type:{
    type:String,
    required:[true, "Please enter type of dish"]
 },
 calories:{
    type:Number,
    required:[true, "Please enter total calories in dish"]
 },
 gram:{
    type:Number,
    required:[true, "Please enter total gram of dish"]
 },
 duration:{
    type:Number,
    required:[true, "Please enter duration of dish"]
 },
 description:{
    type:String,
    required:[true, "Please enter dish description"]
 },
 restaurant:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Restaurant",
    required:true,
 }
});

const Menu = mongoose.model("Menu", menuSchema);

module.exports= Menu;