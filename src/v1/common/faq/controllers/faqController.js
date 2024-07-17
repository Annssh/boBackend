const Faq = require("../models/faqModel");
const { NOT_FOUND } = require("../../../../utils/statuscode");

// Controller to add a new FAQ
const addFaq = async (req, res) => {
  try {
    const { title, type, description } = req.body;
    const faq = new Faq({
      title,
      type,
      description
    });

    const savedFaq = await faq.save();
    res.status(200).json({
      status: 200,
      message: "FAQ added successfully",
      data: savedFaq,
    });
  } catch (error) {
    console.error("Error adding FAQ:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to edit a FAQ by ID
const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, description } = req.body;

    // Find the FAQ by ID
    let faq = await Faq.findById(id);

    if (!faq) {
      return res.status(NOT_FOUND).json({ error: "FAQ not found" });
    }

    // Update FAQ fields
    if(title)
    faq.title = title;

    if(type)
    faq.type = type;
    
    if(description)
    faq.description = description;

    // Save the updated FAQ
    const updatedFaq = await faq.save();

    res.status(200).json({
      status: 200,
      message: "FAQ updated successfully",
      data: updatedFaq,
    });
  } catch (error) {
    console.error("Error editing FAQ:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to delete a FAQ by ID
const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the FAQ by ID
    const faq = await Faq.findByIdAndDelete(id);
    if (!faq) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    // Soft delete the FAQ by marking it as deleted 
    res.status(200).json({
      status: 200,
      message: "FAQ deleted successfully",
      data: faq,
    });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to get a single FAQ by ID
const getFaqById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the FAQ by ID
    const faq = await Faq.findById(id);

    if (!faq) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    res.status(200).json({
      status: 200,
      message: "FAQ retrieved successfully",
      data: faq,
    });
  } catch (error) {
    console.error("Error fetching FAQ by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to get all FAQs
const getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find({});

    res.status(200).json({
      status: 200,
      message: "All FAQs fetched successfully",
      data: faqs,
    });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addFaq,
  updateFaq,
  deleteFaq,
  getFaqById,
  getAllFaqs,
};
