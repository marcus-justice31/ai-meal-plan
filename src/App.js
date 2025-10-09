import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import Login from './Components/Login';
import MealPlanGenerator from './Components/MealPlanGenerator';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mealPlanGenerator" element={<MealPlanGenerator />} />
      </Routes>
    </Router>
  ) 
}

export default App;
