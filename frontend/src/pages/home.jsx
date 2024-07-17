import React, { useState } from 'react'
import {v4 as uuidv4, validate} from 'uuid';
import {toast} from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';

function Home() {
    const [roomId, setRoomId] = useState('');
    const navigate = useNavigate();
    const createRoomdId= ()=>{
        const id = uuidv4();
        setRoomId(id);
    }

    const handleSubmit = (e)=>{
        e.preventDefault();
        if(!validate(roomId)){
            toast.error("Incorrect room id");
            return;
        }
        navigate(`/room/${roomId}`, {state: {userId: 'abcd'}})
    }

  return (
    <>
        <input type="text" value={roomId} onChange={(e)=>setRoomId(e.target.value)} />

        <button onClick={createRoomdId}>Create Room Id</button>

        <button onClick={handleSubmit}>JOIN ROOM</button>
    </>
  )
}

export default Home