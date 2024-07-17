import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {v4 as uuidv4} from 'uuid';
import {BrowserRouter,Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Room from './pages/room';

function App() {
  // const id=  uuidv4();
  // console.log(id);
  return (
     <>
      <Routes>
          {/* <Route path="/" element={<Home/>} /> */}
          <Route path="/" element={<Room/>} />
      </Routes>
     </>
  )
}

export default App
