import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './Components/Login';

function App() {
  return (
    <div>
      <Login />
    </div>
  ) 
}

export default App;
