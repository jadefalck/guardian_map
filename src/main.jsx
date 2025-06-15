//import { StrictMode } from 'react'
//import { createRoot } from 'react-dom/client'
//import './index.css'
//import App from './App.jsx'

//createRoot(document.getElementById('root')).render(
  //<StrictMode>
    //<App />
  //</StrictMode>,)

/*import './index.css'

import { BrowserRouter } from "react-router-dom";
import App from "./App";

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);*/

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // ← pour activer Tailwind

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
