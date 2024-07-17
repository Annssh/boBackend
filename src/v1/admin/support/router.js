const express = require("express");
const { createTicket, getAllTickets, getAllUserTickets, updateTicketStatus } = require("./controllers/ticketController");
const ticketRoute= express.Router();


ticketRoute.get("/admin/tickets", getAllTickets);

ticketRoute.route("/ticket").get(getAllUserTickets).post(createTicket);

ticketRoute.put("/ticket/:ticketId", updateTicketStatus);

module.exports = ticketRoute;