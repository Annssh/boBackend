const Message = require("../v1/chat/models/messageModel")

async function getUsersinRoom(roomId, io, socketID_to_Users_Map) {
    const socketList = await io.in(roomId).allSockets()
    const userslist = []
    console.log(socketList);
    socketList.forEach((each => {
     (each in socketID_to_Users_Map) && userslist.push(socketID_to_Users_Map[each]?.userId)
    }))
  
    return userslist;
  }


  async function updateUserslistAndMessageMap(io, socket, roomId, socketID_to_Users_Map) {
    socket.in(roomId).emit("member left", { userId: socketID_to_Users_Map[socket.id]?.userId})
  
    // update the user list
    delete socketID_to_Users_Map[socket.id]
    const userslist = await getUsersinRoom(roomId, io, socketID_to_Users_Map)
    socket.in(roomId).emit("updating client list", { userslist: userslist })
  
    if(userslist.length === 0)
     await Message.deleteMany({roomId}); 
  }
module.exports = {getUsersinRoom, updateUserslistAndMessageMap}