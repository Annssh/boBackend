const express = require("express");
const { addQuote, getAllQuotes, getQuote, updateQuote, deleteQuote } = require("./controllers/quoteController");
const quoteRoute= express.Router();



quoteRoute.post("/admin/quote", addQuote);

quoteRoute.get("/quotes", getAllQuotes);

quoteRoute.get("/quote", getQuote);

quoteRoute.route("/admin/quote/:id").put(updateQuote).delete(deleteQuote);

module.exports = quoteRoute;