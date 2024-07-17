const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
 title:{
    type:String,
    required:[true, "Please enter restaurant title"]
 },
 address:{
    type:String,
    required:[true, "Please enter restaurant address"]
 },
 image:{
    type:String,
    required:[true, "Please enter restaurant image"]
 },
 openTime:{
    type:String,
    required:[true, "Please enter open time of restaurant"]
 },
 closeTime:{
    type:String,
    required:[true, "Please enter close time of restaurant"]
 },
 phone:{
    type:Number,
    required:[true, "Please enter restaurant phone number"]
 },
 website:{
    type:String,
    required:[true, "Please enter restaurant website"]
 },
 cuisnes:{
    type:String,
    required:[true, "Please enter restaurant cuisnes"]
 },
 description:{
    type:String,
    required:[true, "Please enter restaurant description"]
 },
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports= Restaurant;