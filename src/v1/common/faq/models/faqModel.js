const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Please add faq title."] },
    type: { type: String, required: [true, "Please add faq type."] },
    description: {type: String, required: [true, "Please add faq description."] }
  },
  { timestamps: true }
);

const Faq = mongoose.model("Faq", faqSchema);

module.exports = Faq;
