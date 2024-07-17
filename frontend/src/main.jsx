import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {Toaster} from 'react-hot-toast'
import {BrowserRouter,Routes, Route } from 'react-router-dom';


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
   <BrowserRouter>
   {/* <Toaster> */}
    <App />
   {/* </Toaster> */}
   </BrowserRouter>
  // </React.StrictMode>,
)
