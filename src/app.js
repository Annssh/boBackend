const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const socketIO = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors:{
    origin:"*",
    method:["GET", "POST"]
  }
});
const bodyParser = require("body-parser");
const path = require("path");
const routes = require("./v1/route");
const { getUsersinRoom, updateUserslistAndMessageMap } = require("./utils/features");
const Message = require("./v1/chat/models/messageModel");

// const socketHandler = require("./socket");
// Setting Up App to use data from .env file
dotenv.config();

app.use(
  cors()
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/v1", routes);

// crons jobs  
// Loading Environment Variables
const DB_URL = process.env.MONGO_DB_URL;
const PORT = process.env.PORT || 5000;

// Initializing DB connection
mongoose.set("strictQuery", false);
mongoose.set('strictPopulate', false);
mongoose
  .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is up and running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Error: ${error.message}`);
  });

const socketID_to_Users_Map = {};


 io.on("connection", (socket)=>{
   console.log("A user connected", socket.id);

   socket.on("user join", async({chatId, userId})=>{
     console.log(userId);
     socketID_to_Users_Map[socket.id] = {userId};
     socket.join(chatId);

     const userslist = await getUsersinRoom(chatId, io, socketID_to_Users_Map);

     socket.in(chatId).emit("updating client list", {userslist: userslist});

     io.to(socket.id).emit("updating client list", {userslist: userslist});

    //  const allMessages =  await Message.find({roomId});
    //  io.to(socket.id).emit("getting all messages", {allMessages: allMessages});

     socket.in(chatId).emit("New member joined the chat", {userId});
    })

    socket.on("sync message", async({chatId, msg})=>{
      const message = new Message(msg);
      await message.save(); 

      socket.in(chatId).emit("new message", {message:msg});
    })

    socket.on("disconnecting", (reason) => {
      console.log("disc");
      socket.rooms.forEach(eachRoom => {
          updateUserslistAndMessageMap(io, socket, eachRoom, socketID_to_Users_Map)
      })
    })

    socket.on('disconnect', function () {
      console.log("disc");
      console.log('A user disconnected')
    })
  });



module.exports=io;