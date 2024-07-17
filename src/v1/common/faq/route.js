const express = require("express");
const { addFaq, deleteFaq, getAllFaqs, updateFaq, getFaqById } = require('./controllers/faqController');
const faqRoute = express.Router();

faqRoute.post( "/admin/faq",addFaq);

faqRoute.get("/admin/faqs", getAllFaqs);

faqRoute.route("/admin/faq/:id").get(getFaqById).put(updateFaq).delete(deleteFaq);

module.exports = faqRoute;
