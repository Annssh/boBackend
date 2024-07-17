const mongoose = require("mongoose");
const Ticket = require("../models/ticketModel");
const { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } = require("../../../../utils/statuscode");

const getAllTickets = async(req,res)=>{
    try {
       const tickets = await Ticket.find({}); 
       res.status(OK).json({
        status: OK,
        message: "All Tickets fetched successfully",
        data: tickets,
      });
    } catch (error) {
        console.log(error);
        return res.status(INTERNAL_SERVER_ERROR).json({ error: "An error occurred while fetching tickets." });  
    }
}

const getAllUserTickets = async(req,res)=>{
    try {
       const {user} = req.query;
       const tickets = await Ticket.find({user}); 
       res.status(OK).json({
        status: OK,
        message: "User tickets fetched successfully",
        data: tickets,
      });
    } catch (error) {
        console.log(error);
        return res.status(INTERNAL_SERVER_ERROR).json({ error: "An error occurred while fetching user tickets." });  
    }
}

const createTicket = async(req,res)=>{
 try {
    const {title,ticketId,description} = req.body;
    const user = new mongoose.Types.ObjectId(req.userId);
    const ticket = new Ticket({title,ticketId,description,user});
    await ticket.save();

    return res.status(201).json({
        success: true,
        message: "Ticket created successfully",
        data:ticket
    })  
 } catch (error) {
    console.log(error);
    return res.status(INTERNAL_SERVER_ERROR).json({ error: "An error occurred while creating ticket." });
 }    
}

const updateTicketStatus = async(req,res)=>{
    try {
       const {ticketId}= req.params;
       let ticket = await Ticket.findOne({ticketId});
       if(!ticket){
        return res.status(NOT_FOUND).json({
            success: NOT_FOUND,
            message: "Ticket not found",
        });  
       }
       ticket.status = "solved";
       await ticket.save();
   
       return res.status(201).json({
           success: true,
           message: "Ticket status updated successfully",
       })  
    } catch (error) {
       console.log(error);
       return res.status(INTERNAL_SERVER_ERROR).json({ error: "An error occurred while updating ticket status." });
    }    
   }


module.exports = { createTicket, updateTicketStatus, getAllTickets, getAllUserTickets};