const Quote = require("../models/quoteModel");
const { INTERNAL_SERVER_ERROR, OK, NOT_FOUND, BAD_REQUEST } = require("../../../utils/statuscode");

const addQuote = async (req, res) => {
    try {
        let { quote,publishing_date } = req.body;
        publishing_date = new Date(publishing_date);
        const newQuote = new Quote({ quote, publishing_date });
        await newQuote.save();

        return res.status(201).json({
            success: true,
            message: "Quote added successfully",
            data:newQuote,
        })
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({ error: "An error occurred while adding quote." });
    }
}

const getAllQuotes = async (req, res) => {
    try {
        const quotes = await Quote.find({}).sort({ publishing_date: -1 });

        return res.status(OK).json({
            success: OK,
            message: "Quotes found successfully",
            data: quotes,
        })
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({ error: "An error occurred while finding quote." });
    }
}

const getQuote = async (req, res) => {
    try {
        let { date } = req.query;
        if (!date) {
            return res.status(BAD_REQUEST).json({ error: "Please give the Date parameter" });
        }
        let startDate = new Date(date);
        let endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        console.log(startDate);
        console.log(endDate);


        const quote = await Quote.find({
            publishing_date: { $gte: startDate, $lt: endDate }
        })

        return res.status(OK).json({
            success: OK,
            message: "Quote found successfully",
            data: quote,
        })
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({ error: "An error occurred while finding quote." });
    }
}

const updateQuote = async(req, res)=>{
    try {
    const {id} = req.params;
    const {quote,publishing_date} = req.body;
    if(!quote && !publishing_date){
        console.log('abcd');
        return res.status(BAD_REQUEST).json({
            success:BAD_REQUEST,
            message:"BAD_REQUEST",
        }); 
    }
    let quoteFound = await Quote.findById(id);

    if(!quoteFound){
    return res.status(NOT_FOUND).json({
        success:NOT_FOUND,
        message:"Quote not found",
    });
    }
    if(quote)
     quoteFound.quote= quote;

    if(publishing_date)
    quoteFound.publishing_date= new Date(publishing_date);

    await quoteFound.save();
    return res.status(OK).json({
        success: OK,
        message: "Quote updated successfully",
        data: quoteFound,
    });   
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({ error: "An error occurred while updating quote."});   
    }
}

const deleteQuote = async(req, res)=>{
    try {
    const {id} = req.params;

    const quote = await Quote.findByIdAndDelete(id);;
    if(!quote){
    return res.status(NOT_FOUND).json({
        success:NOT_FOUND,
        message:"Quote not found",
    });
    }
    
    return res.status(OK).json({
        success: OK,
        message: "Quote deleted successfully",
    });   
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({ error: "An error occurred while deleting quote." });   
    }
}

module.exports = { addQuote, getAllQuotes, getQuote, updateQuote, deleteQuote};