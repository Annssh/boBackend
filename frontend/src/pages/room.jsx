import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { io } from "socket.io-client";

let socket;
function Room() {
    // const socket = io.connect("http://localhost:11019")

  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

 console.log(params)
  const [messageText, setMessageText] = useState('');
  const [allMsg , setAllMsg] = useState([]);
  const [userslist, setUserslist] = useState([]);
  const [messageSent, setMessageSent] = useState('');
  const [show,setShow] = useState(false);
  const [chatId, setChatId] = useState("")
  const [blockFrom,setBlockFrom] = useState(false);
  const [blockTo, setBlockTo] = useState(false);

  const handleSubmit = (e)=>{
   e.preventDefault();
   console.log(allMsg)
   if(!messageSent) return;

   const msg = {
    sentBy: '66294c9627334a997dc720e5',
    message: messageSent,
    type: 'default',
    chatId,
   }
   
   setAllMsg(prevAllMsg => [...prevAllMsg, msg]);
   socket.emit("sync message", {chatId, msg})
  }

  useEffect(()=>{
     socket = io.connect("http://localhost:11019")
  },[])
  
//   useEffect(()=>{
//    location.state && location.state.userId ? socket.emit("user join", {roomId: params.roomId, userId: location.state.userId}) : navigate("/");
//   }, [socket, location.state, params.roomId, navigate]);


  useEffect(()=>{
     socket.on("updating client list" , ({userslist})=>{
        console.log(allMsg);
        setUserslist(userslist)
     })

    //  socket.on("getting all messages", ({allMessages})=>{
    //     setAllMsg(allMessages);
    //  })

     socket.on("new message", ({message})=>{
        console.log(allMsg)
        console.log(message)
        setAllMsg(prevAllMsg => [...prevAllMsg, message]);
     })
  },[])


  useEffect(()=>{
    // const getConnected = async()=>{
    //   const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjQ2MGU1ZDZjZGQzNDYzMTA5NmZkMWEiLCJleHAiOjE3MjQxNTI2MDQuMTcsImlhdCI6MTcxODg4MjIwNH0.4-nZgaIjYE2h7Duouk1Q0Mph6aGcW0VjPQ8a7MEfXI4'
    //   const res =await axios.post("http://localhost:11019/api/v1/chat", {user1:'66294c9627334a997dc720e5', user2:'66312a5b9c42fe6f6698e20d'},
    //    {
    //      headers: {
    //         'Authorization': `Bearer ${token}`
    //      }
    //    }
    //   );
    //   console.log(res);
    //   if(res.data.success === 200){
    //      setShow(true);
    //      setChatId(res.data.chatId);
    //      setAllMsg(res.data.data);
    //      // if(!res.data.blocked.isBlock){
    //         socket.emit("user join", {chatId:res.data.chatId, userId: '66294c9627334a997dc720e5'})
    //      // }
    //      // else if(res.data.blocked.from === '66294c9627334a997dc720e5'){
    //      //    setBlockFrom(true);
    //      // }
    //      // else
    //      // setBlockTo(true);
    //   }
    // }
    // getConnected();
  },[])

  const handleStart = async()=>{
   const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjQ2MGU1ZDZjZGQzNDYzMTA5NmZkMWEiLCJleHAiOjE3MjQxNTI2MDQuMTcsImlhdCI6MTcxODg4MjIwNH0.4-nZgaIjYE2h7Duouk1Q0Mph6aGcW0VjPQ8a7MEfXI4'
   const res =await axios.post("http://localhost:11019/api/v1/chat", {user1:'66294c9627334a997dc720e5', user2:'66312a5b9c42fe6f6698e20d'},
    {
      headers: {
         'Authorization': `Bearer ${token}`
      }
    }
   );
   console.log(res);
   if(res.data.success === 200){
      setShow(true);
      setChatId(res.data.chatId);
      setAllMsg(res.data.data);
      localStorage.setItem("all-msg",JSON.stringify(res.data.data));
      localStorage.setItem("chatId",JSON.stringify(res.data.chatId));
      // if(!res.data.blocked.isBlock){
         socket.emit("user join", {chatId:res.data.chatId, userId: '66294c9627334a997dc720e5'})
      // }
      // else if(res.data.blocked.from === '66294c9627334a997dc720e5'){
      //    setBlockFrom(true);
      // }
      // else
      // setBlockTo(true);
   }
 }

  return (
    <>
    <button onClick={handleStart}>Start</button>

    <div>
    {userslist.length>0 && show && userslist.map((name)=>(
      <div>
        {name}
      </div>
     ))}   
    </div>

     <div>
     {allMsg.length>0 && show && allMsg.map((msg)=>(
      <div>
        <p>sent by : {msg.sentBy}</p>
        <p>message : {msg.message}</p>
        <p>type: {msg.type}</p>
        <p>chatId: {msg.chatId}</p>
      </div>
     ))}
     </div>

    {blockTo} <input type="text" value={messageSent} onChange={(e)=> setMessageSent(e.target.value)} />

     <button onClick={handleSubmit}> Send</button>
    </>
  )
}

export default Room