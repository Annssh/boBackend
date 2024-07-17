// Import the necessary modules
const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema({
 quote:{
    type: String,
    required:[true, "Please enter the quote"]
 },
 publishing_date:{
    type:Date,
    default: Date.now
 }
});

// Create the Quote model
const Quote = mongoose.model("Quote", quoteSchema);

// Export the model
module.exports = Quote;
